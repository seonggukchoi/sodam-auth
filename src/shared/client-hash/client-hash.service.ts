import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as config from 'config';

@Injectable()
export class ClientHashService {
  public getClientHash(ip: string, userAgent: string): string {
    const secretKey = config.get<string>('secret_key');

    const clientHashDataOrigin = `${ ip }-${ userAgent }-${ secretKey }`;
    const clientHashData = this.modifyClientHashData(clientHashDataOrigin);
    const hash = crypto.createHash('sha256').update(clientHashData).digest('hex');

    return hash;
  }

  private modifyClientHashData(data: string): string {
    return data
    .split('')
    .reduceRight<string[]>((array, char) => array.concat(char), [])
    .join('');
  }
}
