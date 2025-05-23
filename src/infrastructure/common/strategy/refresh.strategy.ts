import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import { Strategy } from 'passport-jwt';
import { UsersUsecase } from 'src/usecases/users/users.usecase';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(private usersUsecase: UsersUsecase) {
    super({
      jwtFromRequest: (req) => {
        const authHeader = req.headers.authorization;
        if (!authHeader) return null;

        const [type, token] = authHeader.split(' ');
        if (type === 'Bearer' && token) return token;

        return null;
      },
      ignoreExpiration: false,
      secretOrKey: 'your-jwt-secret',
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const user = await this.usersUsecase.getByEmailOrId(payload.sub);

    if (!user) {
      throw new UnauthorizedException({
        message: 'USER_NOT_FOUND_UNAUTHORIZED',
      });
    }
    return user;
  }
}
