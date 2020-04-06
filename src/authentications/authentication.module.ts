import { Module, forwardRef } from '@nestjs/common';
import { DatabaseModule } from '../shared/database.module';
import { ClientHashModule } from '../shared/client-hash/client-hash.module';
import { UserModule } from '../users/user.module';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';

@Module({
  imports: [
    DatabaseModule,
    ClientHashModule,
    UserModule,
  ],
  exports: [AuthenticationService],
  controllers: [AuthenticationController],
  providers: [AuthenticationService],
})
export class AuthenticationModule { }
