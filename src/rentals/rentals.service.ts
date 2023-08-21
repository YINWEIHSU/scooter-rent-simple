import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, DataSource } from 'typeorm'
import { Rental } from './rental.entity'
import { User } from '../users/user.entity'
import { Scooter } from '../scooters/scooter.entity'
import { ScootersService } from '../scooters/scooters.service'
import { UsersService } from '../users/users.service'

@Injectable()
export class RentalsService {
  constructor(
    @InjectRepository(Rental) private repo: Repository<Rental>,
    private scooterService: ScootersService,
    private userService: UsersService,
    private dataSource: DataSource
     ) {}

  async create(scooterId: number, user: User) {
    if (user.currentRental) {
      throw new BadRequestException('User already has a rental')
    }

    const scooter = await this.scooterService.findOneById(scooterId)

    if (!scooter) {
      throw new NotFoundException('Scooter not found')
    }

    if (scooter.currentRental) {
      throw new BadRequestException('Scooter is already rented')
    }

    const rental = this.repo.create()
    rental.scooter = scooter
    rental.user = user
    await this.dataSource.transaction(async manager => {
      await manager.save(Rental, rental)
      await manager.update(Scooter, scooter.id, { currentRental: rental.id, status: 'rented' })
      await manager.update(User, user.id, { currentRental: rental.id })
    })
    return rental
  }

  async findOneById(id: number, user: User) {
    const rental = await this.repo.findOne({ where: { id }, relations: ['scooter', 'user'] })

    if (rental.user.id !== user.id) {
      throw new BadRequestException('User is not the owner of this rental')
    }

    return rental
  }

  async update(id: number, user: User) {
    const rental = await this.findOneById(id, user)

    if (!rental) {
      throw new NotFoundException('Rental not found')
    }

    if (rental.endTime) {
      throw new BadRequestException('Rental has already ended')
    }

    rental.endTime = new Date()
    await this.dataSource.transaction(async manager => {
      await manager.save(Rental, rental)
      await manager.update(Scooter, rental.scooter.id, { currentRental: null, status: 'available' })
      await manager.update(User, rental.user.id, { currentRental: null })
    })
    return rental
  }
}
