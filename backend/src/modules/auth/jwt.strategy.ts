import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from 'src/schemas/user.schema';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  
    constructor(
      private readonly userService: UsersService,
      private readonly config: ConfigService
    ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET') || 'secret',
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