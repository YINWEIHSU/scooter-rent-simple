import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Scooter } from './scooter.entity';

@Injectable()
export class ScootersService {
  constructor(@InjectRepository(Scooter) private repo: Repository<Scooter> ) {}

  async create(name: string) {
    const scooter = this.repo.create({ name });
    await this.repo.save(scooter);
    return scooter;
  }

  async update(id: number, attrs: Partial<Scooter>) {
    const scooter = await this.findOneById(id);
    if (!scooter) {
      return null;
    }
    Object.assign(scooter, attrs);
    await this.repo.save(scooter);
    return scooter;
  }

  async remove(id: number) {
    const scooter = await this.findOneById(id);
    await this.repo.remove(scooter);
    return scooter;
  }

  async findAll() {
    const scooters = await this.repo.find({ relations: ['rentals'] });
    return scooters;
  }

  async findOneById(id: number) {
    if (!id) {
      return null;
    }
    const scooter = await this.repo.findOne({ where:{ id }, relations: ['rentals']});
    return scooter;
  }
}
