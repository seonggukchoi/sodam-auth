import { Controller, HttpException, HttpStatus, Post, Req, Headers, Body } from '@nestjs/common';
import { Request } from 'express';
import { ClientHashService } from '../shared/client-hash';
import { AuthorizationEntity } from '../../entities';
import { AuthenticationService } from './authentication.service';
import { UserSourceType } from '../../types/users';

@Controller({
  path: '/authentications',
})
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly clientHashService: ClientHashService,
  ) { }

  @Post('/login')
  public async login(
    @Req() request: Request,
    @Headers('user-agent') userAgent: string,
    @Body('service_id') serviceId: number,
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('source') source: UserSourceType,
  ): Promise<AuthorizationEntity> {
    const ip = request.ip;
    const clientHash = this.clientHashService.getClientHash(ip, userAgent);

    let authorizationEntity: AuthorizationEntity | null = null;

    try {
      authorizationEntity = await this.authenticationService.login(serviceId, email, password, source, clientHash);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
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
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }

    return isValidPermission;
  }
}
