import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { YandexGptUsecases } from 'src/usecases/yandex/yandex-ai.usecases';

@Controller('yandex-gpt')
export class YandexGptController {
  constructor(private readonly yandexGptUsecases: YandexGptUsecases) {}

  @Get('chat')
  async chat(@Query('q') query: string) {
    return this.yandexGptUsecases.generateText(query);
  }

  @Get('chat-stream')
  async generateStream(@Query('q') q: string, @Res() res: Response) {
    const stream = await this.yandexGptUsecases.generateTextStream(q);

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');

    stream.pipe(res);
  }
}
