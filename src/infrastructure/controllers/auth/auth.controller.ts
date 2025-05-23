import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { AuthUsecase } from 'src/usecases/auth/auth.usecase';
import { UsersUsecase } from 'src/usecases/users/users.usecase';

@Controller('/auth')
export class AuthController {
  constructor(
    private authUsecase: AuthUsecase,
    private userUsecase: UsersUsecase,
    private readonly jwtService: JwtService,
  ) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    console.log('doby', body);
    const user = await this.authUsecase.validateUser(body.email, body.password);
    if (!user) {
      throw new UnauthorizedException({ message: 'Invalid credentials' });
    }
    const res = await this.authUsecase.login(user);

    console.log('res', res);

    return res;
  }

  @Post('refresh')
  async refresh(@Body() body: { refresh_token: string }) {
    console.log('refresh_token;', body.refresh_token);
    if (!body.refresh_token) {
      throw new UnauthorizedException('NO_REFRESH_TOKEN');
    }

    let payload: any;
    try {
      payload = this.jwtService.verify(body.refresh_token, {
        secret: 'your-jwt-secret',
      });
    } catch (err) {
      throw new UnauthorizedException('INVALID_REFRESH_TOKEN');
    }

    const user: User | null = await this.userUsecase.getByEmailOrId(
      payload.email,
    );

    if (!user?.email) {
      throw new UnauthorizedException('USER_NOT_FOUND');
    }

    return await this.authUsecase.login(user);
  }
}
