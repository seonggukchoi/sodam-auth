import { Module, forwardRef } from '@nestjs/common';
import { DatabaseModule } from '../modules';
import { GuardModule } from '../guards';
import { AuthenticationModule } from '../authentications';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    DatabaseModule,
    GuardModule,
    forwardRef(() => AuthenticationModule),
  ],
  exports: [UserService],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule { }
