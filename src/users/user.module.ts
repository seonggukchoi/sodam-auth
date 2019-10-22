import { Module } from '@nestjs/common';
import { DatabaseModule } from '../databases';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [DatabaseModule],
  exports: [UserService],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule { }
