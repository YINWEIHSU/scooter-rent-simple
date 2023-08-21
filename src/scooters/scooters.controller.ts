import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ScootersService } from './scooters.service';
import { AuthGuard } from '../guard/auth.guard';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ScooterDto } from './dtos/scooter.dto';

@Serialize(ScooterDto)
@Controller('scooters')
@UseGuards(AuthGuard)
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
