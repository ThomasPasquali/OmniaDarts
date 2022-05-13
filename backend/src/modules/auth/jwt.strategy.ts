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

/**
 * Provide a user from decrypted bearer token. If this
 * function is called the token is valid and it is not already
 * expired.
 * @param payload 
 * @returns 
 */
async validate(payload: any) : Promise<Partial<User>>{
  const { pwd, ...result } = 
        await this.userService.findById(payload.sub);
  return result; 
}

}