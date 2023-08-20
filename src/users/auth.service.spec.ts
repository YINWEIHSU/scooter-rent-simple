import { Test } from "@nestjs/testing";
import { BadRequestException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";
import { User } from "./user.entity";

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];
    fakeUsersService = {
      findOneByEmail: (email: string) => {
        const filteredUsers = users.filter(user => user.email === email);
        return Promise.resolve(filteredUsers[0]);
      },
      findOneById: (id: number) => {
        const filteredUsers = users.filter(user => user.id === id)
        return Promise.resolve(filteredUsers[0]);
      },
      create: (email: string, password: string) => {
        const user = { id: Date.now(), email, password } as User;
        users.push(user);
        return Promise.resolve(user);
      }
    }

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService
        }
      ]
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an auth service instance', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a hashed password', async () => {
    const user = await service.signup(
      'testuser01@example.com', '12345678',
      'user'
    );
    expect(user.password).not.toEqual('12345678');
  });

  it('throws an error if user signs up with email that is in use', async () => {
    fakeUsersService.findOneByEmail = () =>
      Promise.resolve({ id: 1, email: 'testuser02@example.com', password: '12345678' } as User);
    await expect(service.signup(
      'testuser02@example.com',
       '12345678',
        'user'
       )).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws an error if signin with an unused email', async () => {
    await expect(
      service.signin('testuser03@example.com', '12345678'),
    ).rejects.toThrow(BadRequestException);
  });

  it('throws an error if an invalid password is provided', async () => {
    await service.signup(
      'testuser04@example.com',
      '12345678',
      'user'
      )
    await expect(
      service.signin('testuser04@example.com', '87654321'),
    ).rejects.toThrow(BadRequestException);
  });
})