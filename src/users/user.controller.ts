import { Controller, HttpException, HttpStatus, Inject, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { UserEntity } from '../../entities';
import { UserService } from './user.service';

@Controller({
  path: '/users',
})
export class UserController {
  constructor(
    @Inject(UserService) private readonly userService: UserService,
  ) { }

  @Get('/')
  public async getUsers(): Promise<UserEntity[]> {
    let userEntities: UserEntity[] | null = null;

    try {
      userEntities = await this.userService.fetchUsers();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return userEntities;
  }

  @Get('/:userId')
  public async getUser(
    @Param('userId') userId: number,
  ): Promise<UserEntity> {
    let userEntity: UserEntity | null = null;

    try {
      userEntity = await this.userService.fetchUser(userId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return userEntity;
  }

  @Post('/')
  public async insertUser(
    @Body() userInput: UserEntity,
  ): Promise<UserEntity> {
    let userEntity: UserEntity | null = null;

    try {
      userEntity = await this.userService.insertUser(userInput);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return userEntity;
  }

  @Put('/:userId')
  public async updateUser(
    @Param('userId') userId: number,
    @Body() userInput: UserEntity,
  ): Promise<UserEntity> {
    let userEntity: UserEntity | null = null;

    try {
      userEntity = await this.userService.updateUser(userId, userInput);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return userEntity;
  }

  @Delete('/:userId')
  public async deleteUser(
    @Param('userId') userId: number,
  ): Promise<UserEntity> {
    let userEntity: UserEntity | null = null;

    try {
      userEntity = await this.userService.deleteUser(userId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return userEntity;
  }
}
