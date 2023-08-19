import { Test, TestingModule } from '@nestjs/testing';
import { ScootersController } from './scooters.controller';
import { ScootersService } from './scooters.service';

describe('ScootersController', () => {
  let controller: ScootersController;
  let fakeScooterService = {
    findAll: () => {
      const scooters = [{ id: 1, name: 'Scooter01', status: 'available' }, { id: 2, name: 'Scooter02', status: 'available' }];
      return Promise.resolve(scooters);
    },
    findOneById: (id: number) => {
      const scooter = { id: id, name: 'Scooter01', status: 'available' };
      return Promise.resolve(scooter);
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScootersController],
      providers: [
        {
          provide: ScootersService,
          useValue: fakeScooterService
        }
      ],
    }).compile();

    controller = module.get(ScootersController);
  });

  it('can create a scooter controller instance', () => {
    expect(controller).toBeDefined();
  });

  it('should return all scooters', async () => {
    const result = await controller.findAll();
    expect(result).toEqual([{ id: 1, name: 'Scooter01', status: 'available' }, { id: 2, name: 'Scooter02', status: 'available' }]);
  }
  );

  it('should return a scooter by id', async () => {
    const result = await controller.findOne('1');
    expect(result).toEqual({ id: 1, name: 'Scooter01', status: 'available' });
  }
  );
});
