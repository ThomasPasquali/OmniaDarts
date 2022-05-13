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
  
  /**
   * Check if a user belongs to this domain
   * @param username 
   * @param pass 
   * @returns a user obj without pwd if exists
   */
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

  /**
   * Provide the bearer token starting from user infos
   * @param user user infos
   * @returns access_token
   */
  async login(user: User) {
    const payload = { username: user.nickname, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}