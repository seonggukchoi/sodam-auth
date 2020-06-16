import { Injectable, Inject, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { AuthenticationService } from '../../authentications/authentication.service';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(
    @Inject(AuthenticationService) private readonly authenticationService: AuthenticationService,
  ) { }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const headers = context.getArgByIndex(0).headers;
    const token = headers.token;

    if (!token) {
      return false;
    }

    let isValidToken = false;

    try {
      isValidToken = await this.authenticationService.checkPermission(token);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.FORBIDDEN);
    }

    return isValidToken;
  }
}
