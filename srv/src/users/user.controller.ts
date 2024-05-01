import { UserService } from './users.service';
import { Controller, Get, Logger, Param } from '@nestjs/common';
import { UsersResponseDto } from './users.response.dto';

@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private userService: UserService) { }

  @Get()
  async getAllUsers() {
    this.logger.log('Get all users');
    const users = await this.userService.findAll();
    return users.map((user) => UsersResponseDto.fromUsersEntity(user));
  }

  @Get('/count')
  async getCountUsers() {
    this.logger.log('Get count users');
    const count = await this.userService.count();
    return count;
  }

  @Get('/page/:page')
  async getPage(@Param() params: any) {
    this.logger.log('Get page user');
    const users = await this.userService.page();
    return {
      users: users.filter((user, index) => params.page * 2 * 10 <= index && (+params.page * 2 + 2) * 10 > index),
      count: users.length,
    };
  }
}
