import { NestFactory } from '@nestjs/core';
import * as config from 'config';
import { AppModule } from './app/app.module';

const port = config.get<number>('port');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(port);
}
bootstrap();
