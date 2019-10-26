import { Module } from '@nestjs/common';
import { DatabaseModule } from '../databases';
import { UserModule } from '../users';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
  ],
  exports: [AuthenticationService],
  controllers: [AuthenticationController],
  providers: [AuthenticationService],
})
export class AuthorizationModule { }
