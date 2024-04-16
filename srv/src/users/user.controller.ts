import { UserService } from './users.service';
import { Controller, Get, Logger, Query } from '@nestjs/common';
import { UsersResponseDto } from "./users.response.dto";

@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private userService: UserService) {}

  @Get()
  async getAllUsers(
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 20,
  ) {
    this.logger.log(`Get all users - page: ${page}, pageSize: ${pageSize}`);
    
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const users = await this.userService.findAll({ skip, take });
    const totalCount = await this.userService.countAll();

    return {
      users: users.map((user) => UsersResponseDto.fromUsersEntity(user)),
      totalCount,
    };
  }
}
