import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { LocalUser } from 'src/infrastructure/common/decorators/local-user.decorator';
import { Public } from 'src/infrastructure/common/decorators/public.decorator';
import { Roles } from 'src/infrastructure/common/decorators/roles.decorator';
import { JwtGuard } from 'src/infrastructure/common/guards/jwt.guard';
import { RolesGuard } from 'src/infrastructure/common/guards/roles.guard';
import { UsersUsecase } from 'src/usecases/users/users.usecase';

@Controller('/users')
@UseGuards(JwtGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersUsecase: UsersUsecase) {}

  @Get()
  @Roles('admin')
  async get() {
    return await this.usersUsecase.get();
  }

  @Get('one')
  @Roles('user', 'admin')
  async getOne(@LocalUser() user: User) {
    return await this.usersUsecase.getOne(user.id);
  }

  @Post()
  @Public()
  async create(@Body() data: any) {
    return await this.usersUsecase.create(data);
  }

  @Patch()
  @Roles('admin', 'user')
  async edit(@Body() data: any) {
    return await this.usersUsecase.edit(data);
  }
}
