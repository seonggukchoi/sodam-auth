import { Module } from '@nestjs/common';
import { ClientHashService } from './client-hash.service';

@Module({
  imports: [],
  exports: [ClientHashService],
  controllers: [],
  providers: [ClientHashService],
})
export class ClientHashModule {}
