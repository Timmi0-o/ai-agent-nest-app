import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { IExceptionData } from 'src/domain/exeptions/i-exeption-data';
import { ILogger, ILoggerSymbol } from 'src/domain/logger/i-logger';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(ILoggerSymbol)
    private logger: ILogger,
  ) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request: any = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      exception instanceof HttpException
        ? (exception.getResponse() as IExceptionData)
        : { message: (exception as Error).message, payload: {} };

    const responseData = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      ...message,
    };

    this.logMessage(request, message, status, exception);

    response.status(status).json(responseData);
  }

  private logMessage(
    request: any,
    message: IExceptionData,
    status: number,
    exception: any,
  ) {
    if (status === 500) {
      this.logger.error(
        `method=${request.method} status=${status}  message=${
          message.message ? message.message : null
        }`,
        status >= 500 ? exception.stack : '',
        `End Request for ${request.path}`,
      );
    } else {
      this.logger.warn(
        `method=${request.method} status=${status} message=${
          message.message ? message.message : null
        }`,
        `End Request for ${request.path}`,
      );
    }
  }
}
