import { Module } from '@nestjs/common';

import { DatabaseModule } from '@/modules/database/database.module';

import { HealthModule } from '@/health';
import { AuthenticationModule } from '@/authentication';
import { UserModule } from '@/user';
import { ApplicationModule } from '@/application';

import { AppController } from './app.controller';

@Module({
  imports: [
    DatabaseModule,
    HealthModule,
    AuthenticationModule,
    UserModule,
    ApplicationModule,
  ],
  exports: [],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
