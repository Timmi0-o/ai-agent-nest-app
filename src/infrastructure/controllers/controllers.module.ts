import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TelegrafModule } from 'nestjs-telegraf';
import { AuthUsecase } from 'src/usecases/auth/auth.usecase';
import { ChannelUsecase } from 'src/usecases/channel/channel.usecase';
import { CharacterUsecase } from 'src/usecases/character/character.usecase';
import { TGAiBotUsecases } from 'src/usecases/tg-ai-bot/tg-ai-bot.usecases';
import { UsersUsecase } from 'src/usecases/users/users.usecase';
import { YandexGptUsecases } from 'src/usecases/yandex/yandex-ai.usecases';
import { JwtStrategy } from '../common/strategy/jwt.strategy';
import { LocalStrategy } from '../common/strategy/local.stratefy';
import { RefreshStrategy } from '../common/strategy/refresh.strategy';
import { Argon2Module } from '../services/argon2/argon2.module';
import { PrismaModule } from '../services/prisma/prisma.module';
import { AuthController } from './auth/auth.controller';
import { ChannelController } from './channel/channel.controller';
import { CharacterController } from './character/character.controller';
import { UsersController } from './users/users.controller';
import { YandexGptController } from './yandex/yandex-gpt.controller';

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      useFactory: () => ({
        token: process.env.TELEGRAM_BOT_TOKEN || '',
      }),
    }),

    JwtModule.register({
      secret: 'your-jwt-secret',
      signOptions: {
        expiresIn: 60,
      },
    }),
    PrismaModule,
    Argon2Module,
  ],
  controllers: [
    YandexGptController,
    CharacterController,
    UsersController,
    AuthController,
    ChannelController,
  ],
  providers: [
    YandexGptUsecases,
    TGAiBotUsecases,
    CharacterUsecase,
    UsersUsecase,
    AuthUsecase,
    ChannelUsecase,
    LocalStrategy,
    JwtStrategy,
    RefreshStrategy,
  ],
})
export class ControllersModule {}
