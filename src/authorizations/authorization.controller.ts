import { Controller, Post, Body } from '@nestjs/common';
import { AuthorizationService } from './authorization.service';

@Controller({
  path: '/authorizations',
})
export class AuthorizationController {
  constructor(
    private readonly authorizationService: AuthorizationService,
  ) { }

  @Post('/login')
  public async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ): Promise<boolean> {
    return this.authorizationService.login(email, password);
  }
}
