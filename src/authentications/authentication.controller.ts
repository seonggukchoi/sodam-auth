import { Controller, HttpException, HttpStatus, Post, Body } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthorizationsEntity } from '../../entities';

@Controller({
  path: '/authentications',
})
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
  ) { }

  @Post('/login')
  public async login(
    @Body('service_id') serviceId: number,
    @Body('email') email: string,
    @Body('password') password: string,
  ): Promise<AuthorizationsEntity> {
    let authorizationsEntity: AuthorizationsEntity | null = null;

    try {
      authorizationsEntity = await this.authenticationService.login(serviceId, email, password);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }

    if (!authorizationsEntity) {
      throw new HttpException('Not valid login information', HttpStatus.UNAUTHORIZED);
    }

    return authorizationsEntity;
  }

  @Post('/')
  public async authenticate(
    @Body('token') token: string,
  ): Promise<boolean> {
    let isValidPermission: boolean | null = null;

    try {
      isValidPermission = await this.authenticationService.checkPermissionByToken(token);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }

    if (!isValidPermission) {
      throw new HttpException('Not valid token', HttpStatus.UNAUTHORIZED);
    }

    return isValidPermission;
  }
}
