import { PassportStrategy } from '@nestjs/passport';
//import { Strategy } from 'passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayloadInterface } from './jwt-payload.interface';
import { User } from './user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userRepository: UsersRepository) {
    super({
      secretOrKey: 'temp',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayloadInterface): Promise<User> {
    console.log({ Place: 'jwtStrategy' });
    const { email } = payload;
    const user: User = await this.userRepository.findOne({
      where: { email: email },
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
