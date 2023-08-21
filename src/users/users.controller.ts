import { Body, Controller, Get, HttpCode, Patch, Post, Session, UseGuards } from '@nestjs/common';
import { createUserDto } from './dtos/create-user.dto';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { AuthGuard } from '../guard/auth.guard';

@Controller('users')
export class UsersController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService
  ) {}

  @Post('/signup')
  async createUser(@Body() body: createUserDto, @Session() session: any) {
    const user = await this.authService.signup(body.email, body.password, body.role);
    session.userId = user.id;
    return user;
  }

  @Post('/signin')
  @HttpCode(200)
  async signin(@Body() body: createUserDto, @Session() session: any) {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('/signout')
  @HttpCode(200)
  signout(@Session() session: any) {
    session.userId = null;
  }

  @Get('/:id')
  @UseGuards(AuthGuard)
  async getUser() {
    return 'getUser';
  }

  @Patch('/:id')
  @UseGuards(AuthGuard)
  async updateUser() {
    return 'updateUser';
  }
}
