import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './filters/httpException.filter';
import { AllExceptionsFilter } from '@/filters/error.filter';
import * as serveStatic from 'serve-static';
import * as path from 'path';
import { AuthMiddleware } from './middleware/auth.middleware';
import { AUTH, SWAGGER } from './config/config';
import { TransferInterceptor } from './interceptors/transfer.interceptor';
async function bootstrap() {
  console.log(process.env);
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('/api');
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransferInterceptor());
  app.use(
    serveStatic(path.join(__dirname, '../public'), {
      maxAge: '1d',
      extensions: ['jpg', 'jpeg', 'png', 'gif'],
    }),
  );
  if (SWAGGER) {
    const swaggerOptions = new DocumentBuilder()
      .setTitle('权限管理系统')
      .addBearerAuth()
      .setDescription('包含登录注册，用户管理、角色管理、部门管理、菜单管理')
      .setVersion('v1.0.0')
      .build();
    const document = SwaggerModule.createDocument(app, swaggerOptions);
    SwaggerModule.setup('swagger-ui', app, document);
  }
  AUTH && app.use(AuthMiddleware);
  await app.listen(3001);
}
bootstrap();
