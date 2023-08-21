import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrentUserMiddleware } from './users/middlewares/current-user.middleware';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
import { ScootersModule } from './scooters/scooters.module';
import { RentalsModule } from './rentals/rentals.module';
import { AdminsModule } from './admins/admins.module';
import { User } from './users/user.entity';
import { Scooter } from './scooters/scooter.entity';
import { Rental } from './rentals/rental.entity';
import * as session from 'express-session';

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
    TypeOrmModule.forFeature([User]),
    UsersModule, 
    ScootersModule, 
    RentalsModule, 
    AdminsModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    UsersService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true
      })
    }
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CurrentUserMiddleware)
      .forRoutes('*');

    consumer
      .apply(
        session({
          secret: process.env.SESSION_SECRET,
          resave: false,
          saveUninitialized: false,
          cookie: {
            maxAge: 1000 * 60 * 60 * 8
          }
        })
      )
      .forRoutes('*');
  };
};
