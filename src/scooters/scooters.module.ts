import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScootersController } from './scooters.controller';
import { ScootersService } from './scooters.service';
import { Scooter } from './scooter.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Scooter])],
  controllers: [ScootersController],
  providers: [ScootersService]
})
export class ScootersModule {}
