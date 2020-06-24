import { Module } from '@nestjs/common';
import { ClientHashProvider } from './client-hash.provider';

@Module({
  imports: [],
  exports: [ClientHashProvider],
  controllers: [],
  providers: [ClientHashProvider],
})
export class ClientHashModule {}
