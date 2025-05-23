import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { Argon2Service } from 'src/infrastructure/services/argon2/argon2.service';
import { UsersUsecase } from '../users/users.usecase';

@Injectable()
export class AuthUsecase {
  constructor(
    private userUsecase: UsersUsecase,
    private jwtService: JwtService,
    private readonly argon2Service: Argon2Service,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userUsecase.getByEmailOrId(email);

    if (
      user &&
      (await this.argon2Service.comparePasswords(password, user.password))
    ) {
      return user;
    }
    return null;
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.id };
    const refreshPayload = { email: user.email };

    const accessToken = this.jwtService.sign(payload, {
      secret: 'your-jwt-secret',
      expiresIn: '15m',
    });
    const refreshToken = this.jwtService.sign(refreshPayload, {
      secret: 'your-jwt-secret',
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
      id: user.id,
      username: user.username,
      role: user.role,
    };
  }
}
