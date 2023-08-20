import { Body, Controller, Post, Get, Patch, Param } from '@nestjs/common';
import { CreateScooterDto } from '../scooters/dtos/create-scooter.dto';
import { UpdateScooterDto } from '../scooters/dtos/update-scooter.dto';
import { ScootersService } from '../scooters/scooters.service';
import { UsersService } from '../users/users.service';

@Controller('admins')
export class AdminsController {
  constructor(
    private scootersService: ScootersService,
    private usersService: UsersService
    ) {}

  @Post('/scooter')
  async createScooter(@Body() body: CreateScooterDto) {
    const { name } = body;

    const scooter = await this.scootersService.create(name);

    return scooter;
  }

  @Patch('/scooter/:id')
  async updateScooter(
    @Param('id') id: string,
    @Body() body: UpdateScooterDto
  ) {
    return await this.scootersService.update(parseInt(id), body);
  }

  @Get('/users')
  async findAllUsers() {
    const users = await this.usersService.findAll();
    return users;
  }
}
