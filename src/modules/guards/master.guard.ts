import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import * as config from 'config';

@Injectable()
export class MasterGuard implements CanActivate {
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const headers = context.getArgByIndex(0).headers;

    const headerMasterToken = headers['master-token'];

    if (!headerMasterToken) {
      return false;
    }

    const masterToken = config.get<string>('authentication.master_token');

    if (headerMasterToken !== masterToken) {
      return false;
    }

    return true;
  }
}
