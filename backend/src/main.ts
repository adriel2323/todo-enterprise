import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder,SwaggerModule } from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Task: Enterprise API')
    .setDescription('The perfect task management API')
    .setVersion('1.0')
    .build();
  if(process.env.NODE_ENV !== 'production'){
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document)
  }
  

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
