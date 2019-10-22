import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { HealthModule } from '../health/health.module';
import { AuthorizationModule } from '../authorization/authorization.module';
import { UserModule } from '../user/user.module';
import { ServiceModule } from '../service/service.module';

@Module({
  imports: [
    HealthModule,
    AuthorizationModule,
    UserModule,
    ServiceModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }
