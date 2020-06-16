import { Module } from '@nestjs/common';

import { ClientHashModule } from '../modules/client-hash';
import { UserModule } from '../users';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';

@Module({
  imports: [
    ClientHashModule,
    UserModule,
  ],
  exports: [AuthenticationService],
  controllers: [AuthenticationController],
  providers: [AuthenticationService],
})
export class AuthenticationModule { }
