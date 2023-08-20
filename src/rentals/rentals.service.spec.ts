import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { RentalsService } from './rentals.service';
import { UsersService } from '../users/users.service';
import { ScootersService } from '../scooters/scooters.service';
import { Rental } from './rental.entity';
import { User } from '../users/user.entity';
import { Scooter } from '../scooters/scooter.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('RentalsService', () => {
  let service: RentalsService;
  let fakeUserService: Partial<UsersService>;
  let fakeScooterService: Partial<ScootersService>;
  let fakeRepository: Partial<Record<keyof Repository<Rental>, jest.Mock>>;

  beforeEach(async () => {
    const users: User[] = [
      { id: 1, 
        email: 'user01@example.com',
        password: '12345678', 
        role: 'user',
        rental: null
      },
      {
        id: 2,
        email: 'user02@example.com',
        password: '12345678',
        role: 'user',
        rental: 2
      },
    ]
    const scooters: Scooter[] = [
      {
        id: 1,
        name: 'Scooter01',
        rental: null,
        status: 'available'
      },
      {
        id: 2,
        name: 'Scooter02',
        rental: 2,
        status: 'rented'
      }
    ]
    fakeUserService = {
      findOneById: (id: number) => {
        const filteredUsers = users.filter(user => user.id === id)
        return Promise.resolve(filteredUsers[0]);
      },
      update: (id: number, attrs: Partial<User>) => {
        const user = users.find(user => user.id === id);
        Object.assign(user, attrs);
        return Promise.resolve(user);
      }
    }
    fakeScooterService = {
      findOneById: (id: number) => {
        const filteredScooters = scooters.filter(scooter => scooter.id === id)
        return Promise.resolve(filteredScooters[0]);
      },
      update: (id: number, attrs: Partial<Scooter>) => {
        const scooter = scooters.find(scooter => scooter.id === id);
        Object.assign(scooter, attrs);
        return Promise.resolve(scooter);
      }
    }
    fakeRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn()
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RentalsService,
        {
          provide: UsersService,
          useValue: fakeUserService
        },
        {
          provide: ScootersService,
          useValue: fakeScooterService
        },
        {
          provide: getRepositoryToken(Rental),
          useValue: fakeRepository
        }
      ],
    }).compile();

    service = module.get(RentalsService);
  });

  it('can create a rental service instance', () => {
    expect(service).toBeDefined();
  });

  it('should successfully create a rental', async () => {
    const user = await fakeUserService.findOneById(1);
    const scooter = await fakeScooterService.findOneById(1);
    const startTime = new Date();
    fakeRepository.create.mockReturnValue({ 
      id: 1,
      startTime
     });
    fakeRepository.save.mockResolvedValue({ id: 1,
      startTime,
      user,
      scooter
     });
    const result = await service.create(1, user);
    expect(result).toBeDefined();
    expect(result.scooter).toEqual(scooter);
    expect(result.user).toEqual(user);
    expect(fakeRepository.save).toHaveBeenCalled();
  });

  it('should successfully update a rental', async () => {
    const user = await fakeUserService.findOneById(2);
    const scooter = await fakeScooterService.findOneById(2);
    const endTime = new Date();
    const startTime = new Date(endTime.getTime() - 1000 * 60 * 10);
    fakeRepository.findOne.mockResolvedValue({ 
      id: 2,
      startTime,
      endTime: null,
      user,
      scooter
     });
    fakeRepository.save.mockResolvedValue({ 
      id: 2,
      startTime,
      endTime,
      user,
      scooter
     });
    const result = await service.update(1);
    expect(result).toBeDefined();
    expect(result.endTime).toEqual(endTime);
    expect(result.scooter.status).toEqual('available');
    expect(result.user.rental).toEqual(null);
    expect(fakeRepository.save).toHaveBeenCalled();
  });

  it('should successfully find a rental by id', async () => {
    const user = await fakeUserService.findOneById(2);
    const scooter = await fakeScooterService.findOneById(2);
    const endTime = new Date();
    const startTime = new Date(endTime.getTime() - 1000 * 60 * 10);
    fakeRepository.findOne.mockResolvedValue({ 
      id: 2,
      startTime,
      endTime: null,
      user,
      scooter
     });
    const result = await service.findOneById(2);
    expect(result).toBeDefined();
    expect(fakeRepository.findOne).toHaveBeenCalled();
  })
});
