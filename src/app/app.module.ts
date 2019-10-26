import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { HealthModule } from '../health';
import { AuthenticationModule } from '../authentications';
import { UserModule } from '../users';
import { ServiceModule } from '../services';

@Module({
  imports: [
    HealthModule,
    AuthenticationModule,
    UserModule,
    ServiceModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }
