import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class UserGuard implements CanActivate {
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const headers = context.getArgByIndex(0).headers;

    const token = headers.token;

    if (!token) {
      return false;
    }

    return true;
  }
}
