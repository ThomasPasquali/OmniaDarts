import {
  Controller,
  Get,
  Post,
  Body,
  UnauthorizedException,
  UseGuards,
  InternalServerErrorException,
  Req,
  Res,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '../../schemas/user.schema';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import * as bcrypt from 'bcrypt';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
@ApiTags('auth')
export class AuthController {

  constructor(
    private readonly config: ConfigService,
    private readonly authService: AuthService,
    private readonly userService: UsersService) {}

  @Post()
  @ApiOperation({ description: "Login a user in" })
  @ApiOkResponse({ description: "A user logged in successful"})
  async login(@Body() user : User){
    const u : User = await this.authService.validateUser(user.nickname, user.pwd);
    if(u)
      return await this.authService.login(u);
    else
      throw new UnauthorizedException();
  }

  @Post('register')
  @ApiOperation({ description: "Register a user" })
  @ApiCreatedResponse({ description: "User register successful" })
  @ApiNotFoundResponse({ description: "User not found" })
  async register(@Body() user : User){
    
    const saltOrRounds : number = parseInt(this.config.get('SALTROUNDS'), 10);
    user.pwd = await bcrypt.hash(user.pwd.toString(), saltOrRounds as number);
    const u = await this.userService.create(user);

    if(u) return await this.authService.login(u);
    else throw new InternalServerErrorException();
  }

  // Only for test purposes
  // JWT: logging out means deleting the token client side
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  async logout(@Req() req) {
    return req.user;
  }

  //@UseGuards(AuthGuard("google"))
  @Get("google")
  async signInWithGoogle(@Req() req, @Res() res) {
    console.log(req)
    return res.status(HttpStatus.OK).json(req.user);
  }

  @UseGuards(AuthGuard("google"))
  @ApiOperation({ description: "Sign in with google" })
  @Get("google/redirect")
  async signInWithGoogleRedirect(@Req() req, @Res() res) {
    console.log('porca carota')
    console.log("ciao");
    return res.status(HttpStatus.OK).json(req.user);
    /*console.log(user.accessToken)
    const userFromMongo = 
        await this.userService.findByGoogleToken(user.accessToken);
    console.log('--------------------------');
    console.log(userFromMongo)
    console.log('--------------------------');
    if(userFromMongo) { return this.authService.login(userFromMongo); } 
    const newUser : User = {
      nickname : user.firstName + " " + user.lastName,
      googleToken : user.accessToken
    } as User;
    console.log('ciao')
    const userCreated : User = await this.userService.create(newUser);
    console.log('hei');
    return this.authService.login(userCreated);*/
  }
  
}
