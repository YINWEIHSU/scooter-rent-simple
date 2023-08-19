import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ScootersModule } from './scooters/scooters.module';
import { RentalsModule } from './rentals/rentals.module';
import { AdminsModule } from './admins/admins.module';
import { User } from './users/user.entity';
import { Scooter } from './scooters/scooter.entity';
import { Rental } from './rentals/rental.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.DB_NAME,
      entities: [User, Scooter, Rental],
      // TODO: Remove synchronize in production
      synchronize: true
    }),
    UsersModule, 
    ScootersModule, 
    RentalsModule, 
    AdminsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
