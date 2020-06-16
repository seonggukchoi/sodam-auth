import { Module, forwardRef } from '@nestjs/common';

import { GuardModule } from '@/modules/guards';

import { AuthenticationModule } from '../authentication';

import { UserController } from './user.controller';
import { UserProvider } from './user.provider';

@Module({
  imports: [
    GuardModule,
    forwardRef(() => AuthenticationModule),
  ],
  exports: [UserProvider],
  controllers: [UserController],
  providers: [UserProvider],
})
export class UserModule { }
