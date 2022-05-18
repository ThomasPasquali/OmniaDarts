import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../../schemas/user.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly config: ConfigService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Check if a user belongs to this domain
   * @param username
   * @param pass
   * @returns a user obj without pwd if exists
   */
  async validateUser(username: string, pass: string): Promise<any> {
    const saltOrRounds = parseInt(this.config.get('SALTROUNDS'), 10);

    const user = await this.usersService.findByNickName(username);
    const hash = await bcrypt.hash(pass, saltOrRounds);

    if (user && bcrypt.compare(user.pwd, hash)) {
      return user;
    }
    return null;
  }

  /**
   * Provide the bearer token starting from user infos
   * @param user user infos
   * @returns access_token
   */
  login(user: User) {
    console.log(user);
    const payload = { username: user.nickname, sub: user._id.toString() };
    console.log(payload);
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  googleLogin(req) {
    console.log(req.user);
    if (!req.user) {
      return null;
    }
    return req.user;
  }
}
