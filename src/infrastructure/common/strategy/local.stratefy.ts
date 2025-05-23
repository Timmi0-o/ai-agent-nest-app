import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthUsecase } from 'src/usecases/auth/auth.usecase';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(AuthUsecase) private authUsecase: AuthUsecase) {
    super({ usernameField: 'email', passwordField: 'password' });
  }

  async validate(email: string, password: string) {
    if (!email || !password) {
      throw new UnauthorizedException();
    }

    const user = await this.authUsecase.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException({
        message: 'Invalid username or password.',
      });
    }

    return user;
  }
}
