import { Module } from '@nestjs/common';

import { GuardModule } from '../guards';
import { ServiceController } from './service.controller';
import { ServiceService } from './service.service';

@Module({
  imports: [GuardModule],
  exports: [ServiceService],
  controllers: [ServiceController],
  providers: [ServiceService],
})
export class ServiceModule { }
