import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../../schemas/user.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  
  constructor(
    private config : ConfigService,
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
    const saltOrRounds = parseInt(this.config.get('SALTROUNDS'), 10);;
  
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
  async login(user: Partial<User>) {
    const payload = { username: user.nickname, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signInWithGoogle(data) {
    
    if (!data.user) throw new BadRequestException();

    let user = await this.usersService.findByGoogleToken(data.user.id);
    if (user) return this.login(user);

    user = await this.usersService.findById(data.user._id);
    if (user)
      throw new ForbiddenException(
        "User already exists, but Google account was not connected to user's account"
      );

    try {
      
      const newUser = new User();
      newUser.nickname= data.user.firstName + " " +  data.user.lastName;
      //newUser.email = data.user.email;
      newUser.googleToken = data.user.id;
      await this.usersService.create(newUser);
      return this.login(newUser);
    } catch (e) { throw new InternalServerErrorException(e); }
  }

}