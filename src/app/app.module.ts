import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { HealthModule } from '../health/health.module';

@Module({
  imports: [HealthModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }
