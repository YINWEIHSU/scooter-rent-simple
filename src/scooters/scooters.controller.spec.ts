import { Test, TestingModule } from '@nestjs/testing';
import { ScootersController } from './scooters.controller';

describe('ScootersController', () => {
  let controller: ScootersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScootersController],
    }).compile();

    controller = module.get<ScootersController>(ScootersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
