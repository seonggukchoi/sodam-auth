import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { HealthModule } from '../health/health.module';
import { AuthenticationModule } from '../authentications/authentication.module';
import { UserModule } from '../users/user.module';
import { ServiceModule } from '../services/service.module';

@Module({
  imports: [
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
