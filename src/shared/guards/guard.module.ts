import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database.module';
import { UserService } from './user.service';
import { AuthenticationService } from './authentication.service';
import { MasterGuard } from './master.guard';
import { UserGuard } from './user.guard';

@Module({
  imports: [DatabaseModule],
  exports: [
    MasterGuard,
    UserGuard,
    AuthenticationService,
    UserService,
  ],
  controllers: [],
  providers: [
    MasterGuard,
    UserGuard,
    AuthenticationService,
    UserService,
  ],
})
export class GuardModule { }
