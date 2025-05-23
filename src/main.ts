import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { AllExceptionFilter } from './infrastructure/common/filters/exeptions.filter';
import { ResponseInterceptor } from './infrastructure/common/interceptors/response.interceptor';
import { LoggerService } from './infrastructure/services/logger/logger.service';

const origin = 'http://localhost:4000';

async function aiAgentStart() {
  const PORT = process.env.APPLICATION_PORT ?? 9800;

  const logger = new LoggerService();
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger,
    cors: {
      credentials: true,
      origin,
      allowedHeaders: 'Content-Type, Set-Cookie, authorization',
    },
  });
  app.use(cookieParser());
  app.enableCors({
    origin,
    credentials: true,
  });
  app.useGlobalFilters(new AllExceptionFilter(logger));
  app.useGlobalInterceptors(new ResponseInterceptor());

  await app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
}
aiAgentStart();
