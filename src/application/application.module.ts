import { Module } from '@nestjs/common';

import { GuardModule } from '@/modules/guards';

import { ApplicationController } from './application.controller';
import { ApplicationProvider } from './application.provider';

@Module({
  imports: [GuardModule],
  exports: [ApplicationProvider],
  controllers: [ApplicationController],
  providers: [ApplicationProvider],
})
export class ApplicationModule {}
