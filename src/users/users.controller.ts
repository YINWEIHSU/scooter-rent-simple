import { Body, Controller, Get, Patch, Post, Session } from '@nestjs/common';
import { createUserDto } from './dtos/create-user.dto';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService
  ) {}

  @Post('/signup')
  async createUser(@Body() body: createUserDto, @Session() session: any) {
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('/signin')
  async signin(@Body() body: createUserDto, @Session() session: any) {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('/signout')
  signout(@Session() session: any) {
    session.userId = null;
  }

  @Get('/currentuser')
  async currentUser() {
    return 'currentuser';
  }

  @Get('/:id')
  async getUser() {
    return 'getUser';
  }

  @Patch('/:id')
  async updateUser() {
    return 'updateUser';
  }
}
