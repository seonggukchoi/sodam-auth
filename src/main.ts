import { NestFactory } from '@nestjs/core';
import * as config from 'config';
import { AppModule } from './app';

async function bootstrap() {
  const port = config.get<number>('port');
  const app = await NestFactory.create(AppModule);

  await app.listen(port);
}

bootstrap();
