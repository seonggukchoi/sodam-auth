import { Controller, Get, Post, Body } from '@nestjs/common';
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
    return this.authenticationService.login(serviceId, email, password);
  }

  @Post('/')
  public async authenticate(
    @Body('token') token: string,
  ): Promise<boolean> {
    return this.authenticationService.checkPermissionByToken(token);
  }
}
