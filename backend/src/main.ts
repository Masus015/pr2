import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'], // Включение всех уровней логов
  });

  app.enableCors({
    allowedHeaders: ['Authorization', 'Content-Type'], // Добавьте сюда "Authorization"
  });


  // Настройка Swagger
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('Документация API для вашего проекта')
    .setVersion('1.0')
    .addBearerAuth() // Добавляет поддержку JWT авторизации
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  // Включаем глобальную валидацию
  app.useGlobalPipes(new ValidationPipe());
  // Разрешить запросы с фронтенда
  app.enableCors({
    origin: 'http://localhost:3000', // URL фронтенда
    credentials: true,
  });

  await app.listen(4000);
  console.log(`Application is running on: http://localhost:4000/api`);
}
bootstrap();