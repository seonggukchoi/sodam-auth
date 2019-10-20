import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { ServiceController } from './service.controller';
import { ServiceService } from './service.service';

@Module({
  imports: [DatabaseModule],
  exports: [],
  controllers: [ServiceController],
  providers: [ServiceService],
})
export class ServiceModule { }
