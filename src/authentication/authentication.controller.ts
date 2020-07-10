import { Controller, HttpException, HttpStatus, Post, Req, Headers, Body, Delete, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { ClientHashProvider } from '@/modules/client-hash';
import { MasterGuard } from '@/modules/guards';
import { AuthorizationEntity } from '@/modules/database/entities';

import { UserSourceType } from '@/user/user.interface';

import { AuthenticationProvider } from './authentication.provider';

@Controller({ path: '/authentications' })
export class AuthenticationController {
  constructor(
    private readonly authenticationProvider: AuthenticationProvider,
    private readonly clientHashProvider: ClientHashProvider,
  ) {}

  @Post('/login')
  public async login(
    @Req() request: Request,
    @Headers('user-agent') userAgent: string,
    @Body('applicationId') applicationId: number,
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('source') source: UserSourceType,
  ): Promise<AuthorizationEntity> {
    const ip = request.ip;
    const clientHash = this.clientHashProvider.getClientHash(ip, userAgent);

    let authorizationEntity: AuthorizationEntity | null = null;

    try {
      // TODO Add validator
      authorizationEntity = await this.authenticationProvider.login(applicationId, email, password, source, clientHash);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }

    return authorizationEntity;
  }

  @Post('/')
  public async authenticate(
    @Req() request: Request,
    @Headers('user-agent') userAgent: string,
    @Body('token') token: string,
  ): Promise<boolean> {
    const ip = request.ip;
    const clientHash = this.clientHashProvider.getClientHash(ip, userAgent);

    let isValidPermission: boolean | null = null;

    try {
      isValidPermission = await this.authenticationProvider.checkPermission(token, clientHash);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }

    return isValidPermission;
  }

  @Delete('/truncate')
  @UseGuards(MasterGuard)
  public async truncateAuthorizations(): Promise<boolean> {
    try {
      await this.authenticationProvider.truncateAuthorizations();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return true;
  }
}
