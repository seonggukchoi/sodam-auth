import { Module, forwardRef } from '@nestjs/common';
import { AuthenticationModule } from '../authentication';
import { MasterGuard } from './master.guard';
import { UserGuard } from './user.guard';

@Module({
  imports: [forwardRef(() => AuthenticationModule)],
  exports: [
    MasterGuard,
    UserGuard,
  ],
  controllers: [],
  providers: [
    MasterGuard,
    UserGuard,
  ],
})
export class GuardModule { }
