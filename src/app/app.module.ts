import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { HealthModule } from '../health';
import { AuthorizationModule } from '../authentications';
import { UserModule } from '../users';
import { ServiceModule } from '../services';

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
