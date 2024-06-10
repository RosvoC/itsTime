import * as dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'reflect-metadata';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as exphbs from 'express-handlebars';
import { TransformInterceptor } from './transform.intercepter';

dotenv.config();

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);
  // Register the handlebars engine
  (app as any).engine('hbs', exphbs.engine());

  // Set the view engine to use handlebars
  (app as any).set('view engine', 'hbs');

  const configService = app.get(ConfigService);
  app.setGlobalPrefix(configService.get('API_PREFIX'));

  // Enable the global validation pipe
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());
  app.enableCors({
    origin: configService.get('FRONTEND_URL'),
  });
  await app.listen(configService.get('PORT'));
  logger.log(`Application listening on port ${configService.get('PORT')}`);
}
bootstrap();
