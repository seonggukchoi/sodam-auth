import {
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Headers,
  Body,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import { ClientHashService } from '@/modules/client-hash';
import { MasterGuard } from '@/modules/guards';
import { AuthorizationEntity } from '@/modules/database/entities';

import { UserSourceType } from '@/user/user.interface';

import { AuthenticationProvider } from './authentication.provider';

@Controller({ path: '/authentications' })
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationProvider,
    private readonly clientHashService: ClientHashService,
  ) { }

  @Post('/login')
  public async login(
    @Req() request: Request,
      @Headers('user-agent') userAgent: string,
      @Body('serviceId') serviceId: number,
      @Body('email') email: string,
      @Body('password') password: string,
      @Body('source') source: UserSourceType,
  ): Promise<AuthorizationEntity> {
    const ip = request.ip;
    const clientHash = this.clientHashService.getClientHash(ip, userAgent);

    let authorizationEntity: AuthorizationEntity | null = null;

    try {
      // TODO Add validator
      authorizationEntity = await this.authenticationService.login(serviceId, email, password, source, clientHash);
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
    const clientHash = this.clientHashService.getClientHash(ip, userAgent);

    let isValidPermission: boolean | null = null;

    try {
      isValidPermission = await this.authenticationService.checkPermission(token, clientHash);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }

    return isValidPermission;
  }

  @Delete('/truncate')
  @UseGuards(MasterGuard)
  public async truncateAuthorizations(): Promise<boolean> {
    try {
      await this.authenticationService.truncateAuthorizations();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return true;
  }
}