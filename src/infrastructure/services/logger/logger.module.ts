import { Module } from '@nestjs/common';
import { ILoggerSymbol } from 'src/domain/logger/i-logger';
import { LoggerService } from './logger.service';

@Module({
  providers: [{ provide: ILoggerSymbol, useClass: LoggerService }],
  exports: [ILoggerSymbol],
})
export class LoggerModule {}
