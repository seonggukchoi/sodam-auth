import { Module } from '@nestjs/common';
import { DatabaseModule } from '../databases';
import { UserModule } from '../users';
import { AuthorizationController } from './authorization.controller';
import { AuthorizationService } from './authorization.service';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
  ],
  exports: [AuthorizationService],
  controllers: [AuthorizationController],
  providers: [AuthorizationService],
})
export class AuthorizationModule { }
