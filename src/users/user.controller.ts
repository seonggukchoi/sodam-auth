import { Controller, Inject, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { UsersEntity } from '../../entities';
import { UserService } from './user.service';

@Controller({
  path: '/users',
})
export class UserController {
  @Inject(UserService) private readonly userService: UserService;

  @Get('/')
  public async getUsers(): Promise<UsersEntity[]> {
    return this.userService.fetchUsers();
  }

  @Get('/:userId')
  public async getUser(
    @Param('userId') userId: number,
  ): Promise<UsersEntity> {
    return this.userService.fetchUser(userId);
  }

  @Post('/')
  public async insertUser(
    @Body() userInput: UsersEntity,
  ): Promise<UsersEntity> {
    return this.userService.insertUser(userInput);
  }

  @Put('/:userId')
  public async updateUser(
    @Param('userId') userId: number,
    @Body() userInput: UsersEntity,
  ): Promise<UsersEntity> {
    return this.userService.updateUser(userId, userInput);
  }

  @Delete('/:userId')
  public async deleteUser(
    @Param('userId') userId: number,
  ): Promise<UsersEntity> {
    return this.userService.deleteUser(userId);
  }
}
