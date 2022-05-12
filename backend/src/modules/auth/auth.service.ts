import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class AuthService {
  
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const saltOrRounds = 10;
  
    const user = await this.usersService.findByNickName(username);
    const hash = await bcrypt.hash(pass, saltOrRounds);
    
    if (user && bcrypt.compare(user.pwd, hash)) {
      const { pwd, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User) {
    const payload = { username: user.nickname, sub: user.nickname };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}