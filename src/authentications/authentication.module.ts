import { Module, forwardRef } from '@nestjs/common';
import { DatabaseModule } from '../shared';
import { ClientHashModule } from '../shared/client-hash';
import { UserModule } from '../users';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';

@Module({
  imports: [
    DatabaseModule,
    ClientHashModule,
    UserModule,
  ],
  exports: [AuthenticationService],
  controllers: [AuthenticationController],
  providers: [AuthenticationService],
})
export class AuthenticationModule { }
