import { Body, Controller, Post, Get, Patch, Param, UseGuards } from '@nestjs/common';
import { CreateScooterDto } from '../scooters/dtos/create-scooter.dto';
import { UpdateScooterDto } from '../scooters/dtos/update-scooter.dto';
import { ScootersService } from '../scooters/scooters.service';
import { UsersService } from '../users/users.service';
import { AdminGuard } from '../guard/admin.guard';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ScooterDto } from '../scooters/dtos/scooter.dto';
import { UserDto } from '../users/dtos/user.dto';

@UseGuards(AdminGuard)
@Controller('admins')
export class AdminsController {
  constructor(
    private scootersService: ScootersService,
    private usersService: UsersService
    ) {}

  @Serialize(ScooterDto)
  @Post('/scooter')
  async createScooter(@Body() body: CreateScooterDto) {
    const { name } = body;

    const scooter = await this.scootersService.create(name);

    return scooter;
  }

  @Serialize(ScooterDto)
  @Patch('/scooter/:id')
  async updateScooter(
    @Param('id') id: string,
    @Body() body: UpdateScooterDto
  ) {
    return await this.scootersService.update(parseInt(id), body);
  }

  @Serialize(UserDto)
  @Get('/users')
  async findAllUsers() {
    const users = await this.usersService.findAll();
    return users;
  }
}
