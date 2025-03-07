import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ControllersModule } from './infrastructure/controllers/controllers.module';

@Module({
  imports: [ControllersModule, ConfigModule.forRoot({ isGlobal: true })],
})
export class AppModule {}
