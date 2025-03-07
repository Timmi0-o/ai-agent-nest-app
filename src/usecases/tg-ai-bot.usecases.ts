import { Action, Help, On, Start, Update } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { YandexGptUsecases } from './yandex-ai.usecases';

@Update()
export class TGAiBotUsecases {
  constructor(private readonly yandexGptUsecases: YandexGptUsecases) {}

  @Start()
  startCommand(ctx: Context) {
    ctx.reply('Привет! Я твой лучший ai bot. Выбери одну из опций ниже:', {
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'Генерация текста', callback_data: 'generate_text' },
            { text: 'Получить помощь', callback_data: 'help' },
          ],
        ],
      },
    });
  }

  @Help()
  helpCommand(ctx: Context) {
    ctx.reply('Напиши /start для начала.');
  }

  @On('text')
  async generateTextCommand(ctx: Context) {
    if (ctx.message && 'text' in ctx.message) {
      ctx.reply('Печатает...');
      const messageText = ctx.message.text;
      const generatedText =
        await this.yandexGptUsecases.generateText(messageText);
      ctx.reply(generatedText);
    } else {
      ctx.reply('Что-то пошло не так(');
    }
  }

  @Action('generate_text')
  async handleGenerateText(ctx: Context) {
    ctx.reply(
      'Вы выбрали генерацию текста. Напишите текст после команды /gen.',
    );
  }

  @Action('help')
  async handleHelp(ctx: Context) {
    ctx.reply('Для генерации текста используйте команду /gen <текст>.');
  }
}
