import { Test, TestingModule } from '@nestjs/testing';
import { AdminsController } from './admins.controller';
import { ScootersService } from '../scooters/scooters.service';
import { UsersService } from '../users/users.service';
import { CreateScooterDto } from '../scooters/dtos/create-scooter.dto';
import { UpdateScooterDto } from '../scooters/dtos/update-scooter.dto';

describe('AdminsController', () => {
  let controller: AdminsController;
  let scootersService: ScootersService;
  let usersService: UsersService;

  beforeEach(async () => {
    const fakeScooterService = {
      create: jest.fn(),
      update: jest.fn()
    };
    const fakeUserService = {
      findAll: jest.fn()
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminsController],
      providers: [
        {
          provide: ScootersService,
          useValue: fakeScooterService
        },
        {
          provide: UsersService,
          useValue: fakeUserService
        }
      ]
    }).compile();

    controller = module.get(AdminsController);
    scootersService = module.get(ScootersService);
    usersService = module.get(UsersService);
  });

  it('can create an admin controller instance', () => {
    expect(controller).toBeDefined();
  });

  it('should create a scooter', async () => {
    const dto: CreateScooterDto = { name: 'Scooter A' };
    await controller.createScooter(dto);
    expect(scootersService.create).toHaveBeenCalledWith(dto.name);
  });

  it('should update a scooter', async () => {
    const dto: UpdateScooterDto = { name: 'Updated Name' };
    await controller.updateScooter('1', dto);
    expect(scootersService.update).toHaveBeenCalledWith(1, dto);
  });

  it('should retrieve all users', async () => {
    await controller.findAllUsers();
    expect(usersService.findAll).toHaveBeenCalled();
  });
});
