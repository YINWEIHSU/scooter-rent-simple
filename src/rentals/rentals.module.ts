import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RentalsController } from './rentals.controller';
import { RentalsService } from './rentals.service';
import { UsersService } from 'src/users/users.service';
import { ScootersService } from 'src/scooters/scooters.service';
import { Rental } from './rental.entity';
import { User } from 'src/users/user.entity';
import { Scooter } from 'src/scooters/scooter.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Rental]),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Scooter])
  ],
  controllers: [RentalsController],
  providers: [
    RentalsService,
    UsersService,
    ScootersService
  ]
})
export class RentalsModule {}
