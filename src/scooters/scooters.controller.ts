import { Controller, Get, Param } from '@nestjs/common';
import { ScootersService } from './scooters.service';

@Controller('scooters')
export class ScootersController {
  constructor(private scootersService: ScootersService) {}

  @Get()
  async findAll() {
    const scooters = await this.scootersService.findAll();
    return scooters;
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    const scooter = await this.scootersService.findOneById(parseInt(id));
    return scooter;
  }
}
