import {
  Injectable,
  Inject,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthenticationProvider } from '../../authentication/authentication.provider';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(
    @Inject(AuthenticationProvider)
    private readonly authenticationService: AuthenticationProvider,
  ) {}

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
