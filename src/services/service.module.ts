import { Module } from '@nestjs/common';
import { DatabaseModule, GuardModule } from '../shared';
import { ServiceController } from './service.controller';
import { ServiceService } from './service.service';

@Module({
  imports: [
    DatabaseModule,
    GuardModule,
  ],
  exports: [],
  controllers: [ServiceController],
  providers: [ServiceService],
})
export class ServiceModule { }
