import { Module } from '@nestjs/common';

import { ClientHashModule } from '../modules/client-hash';
import { UserModule } from '../user';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationProvider } from './authentication.provider';

@Module({
  imports: [
    ClientHashModule,
    UserModule,
  ],
  exports: [AuthenticationProvider],
  controllers: [AuthenticationController],
  providers: [AuthenticationProvider],
})
export class AuthenticationModule { }
