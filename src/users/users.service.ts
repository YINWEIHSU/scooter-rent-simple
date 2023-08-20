import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from "bcrypt";
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User> ) {}

  async create(email: string, password: string) {
    const user = this.repo.create({ email, password });
    await this.repo.save(user);
    return user;
  }

  async findOneById(id: number) {
    if (!id) {
      return null;
    }
    const user = await this.repo.findOne({where:{ id }});
    return user;
  }

  async findOneByEmail(email: string) {
    const user = await this.repo.findOne({where:{ email }});
    return user;
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOneById(id);
    if (!user) {
      return null;
    }
    if (attrs.password) {
      const saltOrRounds = 12;
      const hashedPassword = await bcrypt.hash(attrs.password, saltOrRounds);
      attrs.password = hashedPassword;
    }
    Object.assign(user, attrs);
    await this.repo.save(user);

    return user;
  }
}
