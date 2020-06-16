import { Module } from '@nestjs/common';
import { DatabaseModule } from '../modules';
import { GuardModule } from '../guards';
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
