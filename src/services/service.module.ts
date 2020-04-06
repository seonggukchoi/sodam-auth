import { Module } from '@nestjs/common';
import { DatabaseModule } from '../shared/database.module';
import { GuardModule } from '../shared/guards/guard.module';
import { ServiceController } from './service.controller';
import { ServiceService } from './service.service';

@Module({
  imports: [
    DatabaseModule,
    GuardModule,
  ],
  exports: [ServiceService],
  controllers: [ServiceController],
  providers: [ServiceService],
})
export class ServiceModule { }
