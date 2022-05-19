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
    private readonly userService: UsersService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('user')
  async getLoggedUser(@Req() req) {
    return req.user;
  }

  @Post()
  @ApiOperation({ description: 'Login a user in' })
  @ApiOkResponse({ description: 'A user logged in successful' })
  async login(@Body() user: User) {
    const u: User = await this.authService.validateUser(
      user.nickname,
      user.pwd,
    );
    if (u) return await this.authService.login(u);
    else throw new UnauthorizedException();
  }

  @Post('logout')
  @ApiOperation({ description: 'Logout the current user' })
  @ApiOkResponse({ description: 'User logged out successfully' })
  async logout(@Req() req) {
    //TODO eventually blacklist tokens
    return req.user;
  }

  @Post('register')
  @ApiOperation({ description: 'Register a user' })
  @ApiCreatedResponse({ description: 'User register successfuly' })
  @ApiNotFoundResponse({ description: 'User not found' })
  async register(@Body() user: User) {
    const saltOrRounds: number = parseInt(this.config.get('SALTROUNDS'), 10);
    user.pwd = await bcrypt.hash(user.pwd.toString(), saltOrRounds as number);
    user.club = null;
    user.isAdmin = false;
    user.clubRequest = null;
    const u = await this.userService.create(user);

    if (u) return await this.authService.login(u);
    else throw new InternalServerErrorException();
  }

  @Post('google')
  async authenticateGoogle(@Body() tokenData: any, @Req() req) {
    const token = await this.authService.getAccessToken(tokenData);
    const user = await this.authService.validateUserGoogle(token);
    const res = await this.authService.login(user);
    return res;
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'Sign in with google' })
  @Get('google/user')
  async signInWithGoogleRedirect(@Req() req, @Res() res) {
    return res.status(HttpStatus.OK).json(req.user);
  }
}
