import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    const user = await this.repo.findOne({where:{id}});
    return user;
  }

  async findOneByEmail(email: string) {
    const user = await this.repo.findOne({where:{email}});
    return user;
  }
}
