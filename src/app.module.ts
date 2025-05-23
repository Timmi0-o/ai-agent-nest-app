import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { ControllersModule } from './infrastructure/controllers/controllers.module';
import { LoggerModule } from './infrastructure/services/logger/logger.module';

@Module({
  imports: [
    ControllersModule,
    PassportModule,
    LoggerModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
})
export class AppModule {}
