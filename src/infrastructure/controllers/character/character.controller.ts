import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { LocalUser } from 'src/infrastructure/common/decorators/local-user.decorator';
import { Roles } from 'src/infrastructure/common/decorators/roles.decorator';
import { JwtGuard } from 'src/infrastructure/common/guards/jwt.guard';
import { RolesGuard } from 'src/infrastructure/common/guards/roles.guard';
import { CharacterUsecase } from 'src/usecases/character/character.usecase';

@Controller('/character')
@UseGuards(JwtGuard, RolesGuard)
export class CharacterController {
  constructor(private readonly characterUsecase: CharacterUsecase) {}

  @Roles('admin')
  @Get()
  async get() {
    return this.characterUsecase.get();
  }

  @Roles('admin', 'user')
  @Get('one')
  async getOne(@Body('name') name: string) {
    return this.characterUsecase.getOne(name);
  }

  @Roles('admin', 'user')
  @Get('user')
  async getByUser(@LocalUser() user: User) {
    return this.characterUsecase.getByUser(user);
  }

  @Roles('admin', 'user')
  @Post()
  async create(
    @LocalUser() user: User,
    @Body() data: Prisma.CharacterCreateInput,
  ) {
    return this.characterUsecase.create(user, data);
  }

  @Roles('admin', 'user')
  @Patch()
  async edit(@Body() data: Prisma.CharacterCreateInput) {
    return this.characterUsecase.edit(data);
  }
}
