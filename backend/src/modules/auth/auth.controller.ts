import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  UnauthorizedException,
  UseGuards,
  InternalServerErrorException,
  Req,
  Logger,
  NotFoundException,
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

  @Post()
  @ApiOperation({ description: 'Login a user in' })
  @ApiOkResponse({ description: 'A user logged in successful' })
  async login(@Body() user: Partial<User>) {
    const u = await this.authService.validateUser(user.nickname, user.pwd);
    if (u) return await this.authService.login(user);
    else throw new UnauthorizedException();
  }

  @Post('register')
  @ApiOperation({ description: 'Register a user' })
  @ApiCreatedResponse({ description: 'User register successful' })
  @ApiNotFoundResponse({ description: 'User not found' })
  async register(@Body() user: User) {
    const saltOrRounds: number = parseInt(this.config.get('SALTROUNDS'), 10);
    user.pwd = await bcrypt.hash(user.pwd.toString(), saltOrRounds as number);
    const u = await this.userService.create(user);

    if (u) return await this.authService.login(user);
    else throw new InternalServerErrorException();
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  async logout(@Req() req) {
    return req.user;
  }

  @UseGuards(AuthGuard('google'))
  @Get('google')
  async signInWithGoogle() {}

  @UseGuards(AuthGuard('google'))
  @ApiOperation({ description: 'Sign in with google' })
  @Get('google/redirect')
  async signInWithGoogleRedirect(@Req() req) {
    return this.authService.signInWithGoogle(req);
  }
}
