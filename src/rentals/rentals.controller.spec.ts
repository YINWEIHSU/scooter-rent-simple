import { Test, TestingModule } from '@nestjs/testing';
import { RentalsController } from './rentals.controller';
import { RentalsService } from './rentals.service';
import { User } from '../users/user.entity';

describe('RentalsController', () => {
  let controller: RentalsController;
  let fakeRentalsService = {
    create: jest.fn(),
    update: jest.fn(),
    findOneById: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RentalsController],
      providers: [
        {
          provide: RentalsService,
          useValue: fakeRentalsService
        }
      ]
    }).compile();

    controller = module.get(RentalsController);
  });

  it('should create a rental controller instance', () => {
    expect(controller).toBeDefined();
  });

  it('should get a rental by id', async () => {
    const mockUser = {} as User;
    fakeRentalsService.findOneById.mockResolvedValue({ id: 1, scooter: {} });
    const result = await controller.getRental('1', mockUser);
    expect(result).toEqual({ id: 1, scooter: {} });
  });

  it('should create a rental', async () => {
    const mockUser = {} as User;
    const dto = { scooterId: 2 };
    fakeRentalsService.create.mockResolvedValue({ id: 1, scooter: {}, user: mockUser });

    const result = await controller.createRental(dto, mockUser);

    expect(result).toEqual({ id: 1, scooter: {}, user: mockUser });
  });

  it('should update a rental by ID', async () => {
    const mockUser = {} as User;
    fakeRentalsService.update.mockResolvedValue({ id: 1, endTime: new Date() });
    const result = await controller.updateRental('1', mockUser);
    expect(result).toHaveProperty('endTime');
  });
});
