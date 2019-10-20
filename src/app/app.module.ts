import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { HealthModule } from '../health/health.module';
import { ServiceModule } from '../service/service.module';

@Module({
  imports: [
    HealthModule,
    ServiceModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }
