import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import DBconfig from './util/db.util';

async function bootstrap() {
  await DBconfig.loadConfig();
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  await app.listen(9527);
}
bootstrap();
