import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(UsersEntity)
    private usersRepo: Repository<UsersEntity>,
  ) {}

  async findAll(options: { skip?: number; take?: number }): Promise<UsersEntity[]> {
    const { skip = 0, take = 20 } = options;
    return await this.usersRepo.find({
      skip,
      take,
    });
  }

  async countAll(): Promise<number> {
    return await this.usersRepo.count();
  }
}
