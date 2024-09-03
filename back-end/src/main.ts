import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Config Swagger
  const config = new DocumentBuilder()
    .setTitle('Video Sharing API')
    .setDescription('API for video sharing applications')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  // Config CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.setGlobalPrefix('backend');

  await app.listen(3001);
}
bootstrap();
