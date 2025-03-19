import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get(':username')
  async getUserByUsername(
    @Param('username') username: string,
  ): Promise<User | null> {
    return this.usersService.findOne(username);
  }
}
