import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { AuthorizationModule } from '../authorization/authorization.module';

@Module({
  imports: [AuthorizationModule],
  exports: [],
  controllers: [HealthController],
  providers: [],
})
export class HealthModule { }
