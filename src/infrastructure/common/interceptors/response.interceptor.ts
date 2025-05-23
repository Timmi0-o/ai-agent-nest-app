import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class ResponseFormat<T> {
  isArray: boolean;

  result: T;
}

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, void | ResponseFormat<T>>
{
  intercept(
    ctx: ExecutionContext,
    next: CallHandler,
  ): Observable<void | ResponseFormat<T>> {
    const response = ctx.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      map((result) => {
        if (!result) return result;
        else if (result.redirect) response.redirect(result.redirect);
        else if (result.view) response.render(result.view, result.data);
        else if (result.json)
          response.json({
            result: result.data,
            isArray: Array.isArray(result.data),
          });
        else
          return {
            result,
            isArray: Array.isArray(result),
          };
      }),
    );
  }
}
