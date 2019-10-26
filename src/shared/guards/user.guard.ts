import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(private readonly authenticationService: AuthenticationService) { }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const headers = context.getArgByIndex(0).headers;

    const token = headers.token;

    if (!token) {
      return false;
    }

    const isValidToken = await this.authenticationService.checkPermissionByToken(token);

    return isValidToken;
  }
}
