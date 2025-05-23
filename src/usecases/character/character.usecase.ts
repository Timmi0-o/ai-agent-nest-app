import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/infrastructure/services/prisma/prisma.service';

@Injectable()
export class CharacterUsecase {
  constructor(private readonly prismaService: PrismaService) {}

  async get() {
    const res = await this.prismaService.character.findMany();

    return res;
  }

  async getOne(name: string) {
    const res = await this.prismaService.character.findUnique({
      where: { name },
    });

    if (!res?.id) {
      throw new BadRequestException({ message: 'CHARACTER_NOT_FOUND' });
    }

    return res;
  }

  async getByUser(user: User) {
    const res = await this.prismaService.character.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        name: true,
      },
    });

    if (!res?.length) return [];

    return res;
  }

  async create(user: User, data: Prisma.CharacterCreateInput) {
    try {
      const existCharacter = await this.prismaService.character.findUnique({
        where: { name: data.name },
      });

      if (existCharacter?.name)
        throw new BadRequestException({
          message: 'Персонаж с таким менем уже существует, выберите другое имя',
        });

      const newCharacter = await this.prismaService.character.create({
        data: {
          ...data,
          user: { connect: { id: user.id } },
        },
      });

      if (!newCharacter.id)
        throw new BadRequestException({
          message: 'NEW_CHARACTER_IS_NOT_CREATED',
        });

      return true;
    } catch (error) {
      throw new Error(error);
    }
  }

  async edit(data: Prisma.CharacterUpdateInput) {
    console.log('data;', data);
    try {
      const existCharacter = await this.prismaService.character.findUnique({
        where: { name: data?.name as string },
      });

      if (!existCharacter?.name)
        throw new BadRequestException({
          message: 'Персонажа с таким менем не существует!',
        });

      await this.prismaService.character.update({
        data: {
          ...data,
        },
        where: { id: existCharacter?.id },
      });

      return true;
    } catch (error) {
      throw new Error(error);
    }
  }
}
