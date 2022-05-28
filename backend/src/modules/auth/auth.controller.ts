import {
  Body,
  Controller,
  Get,
  HttpStatus,
  InternalServerErrorException,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import SimpleUser from '../../classes/SimpleUser';
import { User } from '../../schemas/user.schema';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

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
  @ApiOperation({ description: 'Return the current user authenticated' })
  @ApiOkResponse({ description: 'The user logged in', type: User })
  @Get('user')
  async getLoggedUser(@Req() req) {
    return req.user;
  }

  @Post()
  @ApiOperation({ description: 'Login a user in' })
  @ApiOkResponse({ description: 'A user logged in successfully', type: User })
  @ApiBody({
    description: 'Simple user',
    type: SimpleUser,
  })
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
  @ApiOkResponse({ description: 'User logged out successfully', type: User })
  async logout(@Req() req) {
    //TODO eventually blacklist tokens
    return req.user;
  }

  @Post('register')
  @ApiOperation({ description: 'Register a user with nickname and password' })
  @ApiCreatedResponse({
    description: 'User register successfully',
    type: SimpleUser,
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiBody({
    description: 'Simple user',
    type: SimpleUser,
  })
  async register(@Body() user: User) {
    const saltOrRounds: number = parseInt(this.config.get('SALTROUNDS'), 10);
    user.pwd = await bcrypt.hash(user.pwd.toString(), saltOrRounds as number);
    const u = await this.userService.create(user);

    if (u) return await this.authService.login(u);
    else throw new InternalServerErrorException();
  }

  @Post('google')
  async authenticateGoogle(@Body() tokenData: any) {
    //, @Req() req) {
    const token = await this.authService.getAccessToken(tokenData);
    const user = await this.authService.validateUserGoogle(token);
    const res = await this.authService.login(user);
    return res;
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'Sign in with google' })
  @ApiOkResponse({ description: 'A user logged in succesfully using google' })
  @Get('google/user')
  async signInWithGoogleRedirect(@Req() req, @Res() res) {
    return res.status(HttpStatus.OK).json(req.user);
  }
}
