import { ConsoleLogger, Injectable } from '@nestjs/common';

@Injectable()
export class LoggerService extends ConsoleLogger {
  constructor() {
    super();
    this.options = {
      timestamp: false,
      logLevels: ['log', 'warn', 'debug', 'error'],
      colors: true,
    };
  }
}
