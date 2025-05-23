import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { LocalUser } from 'src/infrastructure/common/decorators/local-user.decorator';
import { Public } from 'src/infrastructure/common/decorators/public.decorator';
import { Roles } from 'src/infrastructure/common/decorators/roles.decorator';
import { JwtGuard } from 'src/infrastructure/common/guards/jwt.guard';
import { RolesGuard } from 'src/infrastructure/common/guards/roles.guard';
import { ChannelUsecase } from 'src/usecases/channel/channel.usecase';

@Controller('/channel')
@UseGuards(JwtGuard, RolesGuard)
export class ChannelController {
  constructor(private readonly channelUsecase: ChannelUsecase) {}

  @Public()
  @Get('all')
  async get() {
    return await this.channelUsecase.getAll();
  }

  @Roles('admin', 'user')
  @Get(':id')
  async getByChatId(@LocalUser() user: any, @Param('id') id: string) {
    return this.channelUsecase.getByChatId(id, user);
  }

  @Roles('admin', 'user')
  @Post()
  async create(
    @LocalUser() user: User,
    @Body() data: Prisma.ChannelCreateInput & { characterId?: number },
  ) {
    return this.channelUsecase.create(user, data);
  }
}
