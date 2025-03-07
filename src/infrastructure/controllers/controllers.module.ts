import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { TGAiBotUsecases } from 'src/usecases/tg-ai-bot.usecases';
import { YandexGptUsecases } from 'src/usecases/yandex-ai.usecases';
import { YandexGptController } from './yandex-ai.controller';

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      useFactory: () => ({
        token: process.env.TELEGRAM_BOT_TOKEN || '',
      }),
    }),
  ],
  controllers: [YandexGptController],
  providers: [YandexGptUsecases, TGAiBotUsecases],
})
export class ControllersModule {}
