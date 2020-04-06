import { Module, forwardRef } from '@nestjs/common';
import { DatabaseModule } from '../shared/database.module';
import { GuardModule } from '../shared/guards/guard.module';
import { AuthenticationModule } from '../authentications/authentication.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    DatabaseModule,
    GuardModule,
    UserModule,
    forwardRef(() => AuthenticationModule),
  ],
  exports: [UserService],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule { }
