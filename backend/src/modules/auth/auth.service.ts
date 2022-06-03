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
import { google, Auth } from 'googleapis';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { use } from 'passport';
import { oauth2 } from 'googleapis/build/src/apis/oauth2';
import {generateString} from "../../utils/utilFunctions";

@Injectable()
export class AuthService {
  oauthClient: Auth.OAuth2Client;

  constructor(
    private readonly config: ConfigService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {
    const clientID = config.get<string>('GOOGLE_CLIENT_ID');
    const clientSecret = config.get<string>('GOOGLE_SECRET');

    this.oauthClient = new google.auth.OAuth2(clientID, clientSecret);
    google.options({ auth: this.oauthClient });

    this.oauthClient.generateAuthUrl({
      access_type: 'online',
      scope: ['profile', 'email'],
    });
  }

  /**
   * Check if a user belongs to this domain
   * @param username
   * @param pass
   * @returns a user obj without pwd if exists
   */
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByNickName(username);

    if (user && (await bcrypt.compare(pass, user.pwd))) {
      return user;
    }
    return null;
  }

  /**
   * Provide the bearer token starting from user infos
   * @param user user infos
   * @returns access_token
   */
  async login(user: User) {
    console.log(user);
    const payload = { username: user.nickname, sub: user._id };
    console.log(payload);
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async getAccessToken(code: any) {
    const googleResp = await this.oauthClient.getToken(code);
    this.oauthClient.setCredentials(googleResp.tokens);
    return googleResp.tokens.access_token;
  }

  async validateUserGoogle(token: any) {
    const tokenInfo = await this.oauthClient.getTokenInfo(
      token,
    );
    let user = await this.usersService.findByGoogleToken(tokenInfo.sub);
    const info = await oauth2('v2').userinfo.v2.me.get({
      auth: this.oauthClient,
    });
    if (user == null) {
      const sameName = (await this.usersService.findAllWithSame(info.data.name))
        .length;
      user = {
        nickname: info.data.name + (sameName == 0 ? '' : '-' + sameName),
        imageUrl: info.data.picture,
        googleToken: tokenInfo.sub,
        pwd: generateString(36),
      } as User;
      user = await this.usersService.create(user);
    }
    return user;
  }

  async authenticate(code: string) {
    //

    //console.log(tokenInfo)

    //const email = tokenInfo.email;
    try {
      //const user = await this.usersService.getByEmail(email);
      //registered
    } catch (error) {
      if (error.status !== 404) {
        throw new error();
      }
      // uNregistered
      //return this.registerUser(token, email);
    }
  }
}
