import { Module } from '@nestjs/common';

import { GuardModule } from '@/modules/guards';

import { ServiceController } from './service.controller';
import { ServiceProvider } from './service.provider';

@Module({
  imports: [GuardModule],
  exports: [ServiceProvider],
  controllers: [ServiceController],
  providers: [ServiceProvider],
})
export class ServiceModule {}
