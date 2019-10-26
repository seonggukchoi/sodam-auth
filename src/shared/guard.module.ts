import { Module } from '@nestjs/common';
import { DatabaseModule } from './database.module';
import { UserService } from './guards/user.service';
import { AuthenticationService } from './guards/authentication.service';
import { MasterGuard, UserGuard } from './guards';

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
