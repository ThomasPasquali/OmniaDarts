import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from 'src/schemas/user.schema';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  
    constructor(
      private readonly userService: UsersService
    ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'secret',
    });
  }

  async validate(payload: any) : Promise<Partial<User>>{
    const { pwd, ...result } = 
          await this.userService.findByNickName(payload.sub);
    return result; 
  }

}