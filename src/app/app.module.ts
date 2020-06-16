import { Module } from '@nestjs/common';

import { DatabaseModule } from '@/modules/database/database.module';

import { HealthModule } from '../health';
import { AuthenticationModule } from '../authentications';
import { UserModule } from '../users';
import { ServiceModule } from '../services';

import { AppController } from './app.controller';

@Module({
  imports: [
    DatabaseModule,
    HealthModule,
    AuthenticationModule,
    UserModule,
    ServiceModule,
  ],
  exports: [],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }
