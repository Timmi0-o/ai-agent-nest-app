import { Controller, Get, Query } from '@nestjs/common';
import { YandexGptUsecases } from 'src/usecases/yandex-ai.usecases';

@Controller('yandex-gpt')
export class YandexGptController {
  constructor(private readonly yandexGptUsecases: YandexGptUsecases) {}

  @Get('chat')
  async chat(@Query('q') query: string) {
    return this.yandexGptUsecases.generateText(query);
  }
}
