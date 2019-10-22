import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { UserModule } from '../user/user.module';
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
