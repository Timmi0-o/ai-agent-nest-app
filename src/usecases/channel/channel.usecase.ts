import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/infrastructure/services/prisma/prisma.service';

@Injectable()
export class ChannelUsecase {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll() {
    return await this.prismaService.channel.findMany();
  }

  async getByChatId(id: string, user: any) {
    const channel = await this.prismaService.channel.findUnique({
      where: { chatId: id, userId: user.id },
    });

    if (!channel?.id)
      throw new BadRequestException({ message: 'CHANNEL_NOT_FOUND' });

    return channel;
  }

  async create(
    user: User,
    data: Prisma.ChannelCreateInput & { characterId?: number },
  ) {
    if (!data.chatId) {
      throw new BadRequestException({ message: 'CHAT_ID_NOT_FOUND' });
    }

    const isExistCharacter = await this.prismaService.character.findUnique({
      where: { id: data.characterId },
      select: { id: true },
    });

    const existCharacterWithChannelId =
      await this.prismaService.character.findUnique({
        where: { id: data.characterId },
        include: { channel: true },
      });

    if (existCharacterWithChannelId?.channel) {
      throw new BadRequestException({
        message: 'CHARACTER_ALREADY_HAS_CHANNEL',
      });
    }

    await this.prismaService.channel.create({
      data: {
        chatId: data.chatId,
        title: data.title,
        user: { connect: { id: user.id } },
        ...(isExistCharacter?.id
          ? { character: { connect: { id: isExistCharacter.id } } }
          : {}),
      },
    });

    return true;
  }
}
