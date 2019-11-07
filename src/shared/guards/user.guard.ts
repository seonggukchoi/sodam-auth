import { Injectable, Inject, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';

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

    const isValidToken = await this.authenticationService.checkPermission(token);

    return isValidToken;
  }
}
