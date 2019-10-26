import { Module } from '@nestjs/common';
import { MasterGuard, UserGuard } from './guards';

@Module({
  imports: [],
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
