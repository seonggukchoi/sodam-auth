import { Controller, Get, Post, Body } from '@nestjs/common';
import { AuthorizationService } from './authorization.service';
import { AuthorizationsEntity } from '../../entities';

@Controller({
  path: '/authorizations',
})
export class AuthorizationController {
  constructor(
    private readonly authorizationService: AuthorizationService,
  ) { }

  @Post('/login')
  public async login(
    @Body('service_id') serviceId: number,
    @Body('email') email: string,
    @Body('password') password: string,
  ): Promise<AuthorizationsEntity> {
    return this.authorizationService.login(serviceId, email, password);
  }

  @Post('/')
  public async authenticate(
    @Body('token') token: string,
  ): Promise<boolean> {
    return this.authorizationService.checkAuthorizationByToken(token);
  }
}
