import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UsersService', () => {
  let service: UsersService;
  let fakeRepository: Partial<Record<keyof Repository<User>, jest.Mock>>;

  beforeEach(async () => {
    fakeRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn()
    }
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: fakeRepository
        }
      ],
    }).compile();

    service = module.get(UsersService);
  });

  it('can create a user service instance', () => {
    expect(service).toBeDefined();
  });

  it('should successfully create a user', async () => {
    fakeRepository.create.mockReturnValue({ id: 1, email: 'test@example.com' });
    fakeRepository.save.mockResolvedValue(true);

    const user = await service.create('test@example.com', 'password', 'user');
    expect(user).toEqual({ id: 1, email: 'test@example.com' });
  });

  it('should find a user by id', async () => {
    fakeRepository.findOne.mockResolvedValue({ id: 1, email: 'test@example.com' });

    const user = await service.findOneById(1);
    expect(user).toEqual({ id: 1, email: 'test@example.com' });
  });

  it('should find a user by email', async () => {
    fakeRepository.findOne.mockResolvedValue({ id: 1, email: 'test@example.com' });

    const user = await service.findOneByEmail('test@example.com');
    expect(user).toEqual({ id: 1, email: 'test@example.com' });
  });

  it('should update a user', async () => {
    const updatedUser = { id: 1, email: 'newemail@example.com', password: 'password' };
    fakeRepository.findOne.mockResolvedValue(updatedUser);
    fakeRepository.save.mockResolvedValue(true);

    const user = await service.update(1, { email: 'newemail@example.com', password: 'newpassword' });
    expect(user).toEqual(updatedUser);
    expect(user.password).not.toEqual('newpassword');
  });
});
