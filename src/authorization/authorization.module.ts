import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../database/database.module';
import { AuthorizationService } from './authorization.service';

@Module({
  imports: [DatabaseModule],
  exports: [AuthorizationService],
  controllers: [],
  providers: [AuthorizationService],
})
export class AuthorizationModule { }
