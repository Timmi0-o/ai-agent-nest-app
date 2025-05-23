import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Argon2Service } from 'src/infrastructure/services/argon2/argon2.service';
import { PrismaService } from 'src/infrastructure/services/prisma/prisma.service';

@Injectable()
export class UsersUsecase {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly argon2Service: Argon2Service,
  ) {}

  async get() {
    return await this.prismaService.user.findMany({
      include: {
        channels: true,
        characters: true,
      },
    });
  }

  async getByEmailOrId(id: string | number) {
    const query = {
      where: isNaN(id as any) ? { email: id } : { id: id },
    };

    return await this.prismaService.user.findUnique(query as any);
  }

  async getOne(id: string | number) {
    const query = {
      where: isNaN(id as any) ? { email: id } : { id: id },
      include: {
        characters: {
          include: {
            channel: true,
          },
        },
        channels: {
          include: {
            character: true,
          },
        },
      },
    };

    return await this.prismaService.user.findUnique(query as any);
  }

  async create(data: Prisma.UserCreateInput) {
    const existUser = await this.prismaService.user.findUnique({
      where: { email: data.email },
    });

    if (existUser)
      throw new BadRequestException({ message: 'USER_ALREADY_EXIST' });

    data.password = await this.argon2Service.hashPassword(data.password);

    await this.prismaService.user.create({
      data: {
        email: data.email,
        password: data.password,
        username: data.username,
      },
    });

    return true;
  }

  async edit(data: any) {
    const existUser = await this.prismaService.user.findUnique({
      where: { id: data.id },
    });

    if (!existUser?.id)
      throw new BadRequestException({ message: 'ERROR_USER_NOT_FOUND' });

    await this.prismaService.user.update({ where: { id: existUser.id }, data });

    return true;
  }
}
