import { Module } from '@nestjs/common';
import { AdminsController } from './admins.controller';
import { AdminsService } from './admins.service';
import { ScootersService } from '../scooters/scooters.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Scooter } from '../scooters/scooter.entity';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Scooter]),
    TypeOrmModule.forFeature([User])
  ],
  controllers: [AdminsController],
  providers: [
    AdminsService,
    ScootersService,
    UsersService
  ]
})
export class AdminsModule {}
