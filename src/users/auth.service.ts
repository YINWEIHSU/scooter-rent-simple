import { Injectable, BadRequestException } from '@nestjs/common'
import { UsersService } from './users.service'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string, role: string) {
    const users = await this.usersService.findOneByEmail(email)

    if (users) {
      throw new BadRequestException('Email in use')
    }

    const saltOrRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltOrRounds)
    const user = await this.usersService.create(email, hashedPassword, role)

    return user
  }

  async signin(email: string, password: string) {
    const user = await this.usersService.findOneByEmail(email)

    if (!user) {
      throw new BadRequestException('Invalid credentials')
    }

    const valid = await bcrypt.compare(password, user.password)

    if (!valid) {
      throw new BadRequestException('Invalid credentials')
    }

    return user
  }
}
