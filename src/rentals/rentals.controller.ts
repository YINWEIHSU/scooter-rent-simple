import { Controller, Get, Patch, Post, Param, Body, UseGuards } from '@nestjs/common';
import { RentalsService } from './rentals.service';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { createRentalDto } from './dtos/create-rental.dto';
import { AuthGuard } from '../guard/auth.guard';
import { Serialize } from '../interceptors/serialize.interceptor';
import { RentalDto } from './dtos/rental.dto';

@Serialize(RentalDto)
@Controller('rentals')
@UseGuards(AuthGuard)
export class RentalsController {
  constructor(private rentalsService: RentalsService) {}

  @Get('/:id')
  async getRental(@Param('id') id: string, @CurrentUser() user: User){
    const rental = await this.rentalsService.findOneById(parseInt(id), user);
    return rental;
  };

  @Post()
  async createRental(@Body() body: createRentalDto, @CurrentUser() user: User){
    const { scooterId } = body;
    const rental = await this.rentalsService.create(scooterId, user);

    return rental;
  };

  @Patch('/:id')
  async updateRental(@Param('id') id: string, @CurrentUser() user: User){
    const rental = await this.rentalsService.update(parseInt(id), user);

    return rental;
  };
};
