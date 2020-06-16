import { Controller, UseGuards, HttpException, HttpStatus, Inject, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { MasterGuard } from '../modules/guards';
import { UserEntity } from '../modules/database/entities';
import { UserProvider } from './user.provider';

@Controller({ path: '/users' })
export class UserController {
  constructor(private readonly userService: UserProvider) { }

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
    @Body() userInput: Pick<UserEntity, 'serviceId' | 'source' | 'email' | 'password' | 'name'>,
  ): Promise<UserEntity> {
    let userEntity: UserEntity | null = null;

    try {
      // TODO Add validator
      userEntity = await this.userService.insertUser(userInput);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return userEntity;
  }

  @Put('/:userId')
  public async updateUser(
    @Param('userId') userId: number,
      @Body() userInput: Pick<UserEntity, 'email' | 'password' | 'source' | 'name'>,
  ): Promise<UserEntity> {
    let userEntity: UserEntity | null = null;

    try {
      // TODO Add validator
      userEntity = await this.userService.updateUser(userId, userInput);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return userEntity;
  }

  @Delete('/truncate')
  @UseGuards(MasterGuard)
  public async truncateUsers(): Promise<boolean> {
    try {
      await this.userService.truncateUsers();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return true;
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
