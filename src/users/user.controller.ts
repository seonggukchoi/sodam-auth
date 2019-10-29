import { Controller, HttpException, HttpStatus, Inject, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { UsersEntity } from '../../entities';
import { UserService } from './user.service';

@Controller({
  path: '/users',
})
export class UserController {
  constructor(
    @Inject(UserService) private readonly userService: UserService,
  ) { }

  @Get('/')
  public async getUsers(): Promise<UsersEntity[]> {
    let usersEntities: UsersEntity[] | null = null;

    try {
      usersEntities = await this.userService.fetchUsers();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return usersEntities;
  }

  @Get('/:userId')
  public async getUser(
    @Param('userId') userId: number,
  ): Promise<UsersEntity> {
    let usersEntity: UsersEntity | null = null;

    try {
      usersEntity = await this.userService.fetchUser(userId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return usersEntity;
  }

  @Post('/')
  public async insertUser(
    @Body() userInput: UsersEntity,
  ): Promise<UsersEntity> {
    let usersEntity: UsersEntity | null = null;

    try {
      usersEntity = await this.userService.insertUser(userInput);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return usersEntity;
  }

  @Put('/:userId')
  public async updateUser(
    @Param('userId') userId: number,
    @Body() userInput: UsersEntity,
  ): Promise<UsersEntity> {
    let usersEntity: UsersEntity | null = null;

    try {
      usersEntity = await this.userService.updateUser(userId, userInput);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return usersEntity;
  }

  @Delete('/:userId')
  public async deleteUser(
    @Param('userId') userId: number,
  ): Promise<UsersEntity> {
    let usersEntity: UsersEntity | null = null;

    try {
      usersEntity = await this.userService.deleteUser(userId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return usersEntity;
  }
}
