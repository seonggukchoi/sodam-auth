import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as config from 'config';

@Injectable()
export class ClientHashProvider {
  public getClientHash(ip: string, userAgent: string): string {
    const secretKey = config.get<string>('authentication.secret_key');

    const clientHashDataOrigin = `${ip}-${userAgent}-${secretKey}`;
    const clientHashData = this.reverseClientHashData(clientHashDataOrigin);
    const hash = crypto
      .createHash('sha256')
      .update(clientHashData)
      .digest('hex');

    return hash;
  }

  private reverseClientHashData(data: string): string {
    return data
      .split('')
      .reverse()
      .join('');
  }
}
