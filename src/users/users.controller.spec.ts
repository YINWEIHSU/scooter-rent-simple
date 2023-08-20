import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { createUserDto } from './dtos/create-user.dto';


describe('UsersController', () => {
  let controller: UsersController;
  let fakeAuthService = {
    signup: jest.fn(),
    signin: jest.fn()
  }
  let fakeUsersService = {
    findOne: jest.fn(),
    create: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: AuthService,
          useValue: fakeAuthService
        },
        {
          provide: UsersService,
          useValue: fakeUsersService
        }
      ]
    }).compile();

    controller = module.get(UsersController);
  });

  it('can create a user controller instance', () => {
    expect(controller).toBeDefined();
  });

  it('should signup a user and set userId to session', async () => {
    const session:any = {};
    const dto: createUserDto = {
      email: 'test01@example.com',
      password: '12345678',
    };
    fakeAuthService.signup.mockResolvedValueOnce({ id: 1 });

    const result = await controller.createUser(dto, session);

    expect(result).toEqual({ id: 1 });
    expect(session.userId).toEqual(1);
  });

  it('should signin a user and set userId to session', async () => {
    const session:any = {};
    const dto: createUserDto = {
      email: 'test01@example.com',
      password: '12345678',
    };
    fakeAuthService.signin.mockResolvedValueOnce({ id: 1 });

    const result = await controller.signin(dto, session);

    expect(result).toEqual({ id: 1 });
    expect(session.userId).toEqual(1);
  });

  it('should signout a user and set userId to null', async () => {
    const session:any = { userId: 1 };

    controller.signout(session);

    expect(session.userId).toEqual(null);
  });
});
