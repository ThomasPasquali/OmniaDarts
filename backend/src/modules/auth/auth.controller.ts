import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UnauthorizedException, UseGuards, InternalServerErrorException, Req, Logger, NotFoundException } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import * as bcrypt from 'bcrypt';

@Controller('auth')
@ApiTags('auth')
export class AuthController {

  constructor(private readonly authService: AuthService,
              private readonly userService: UsersService) {}

  @Post()
  @ApiOperation({ description: "Login a user in" })
  @ApiOkResponse({
      description: "A user logged in successful",
  })
  async login(@Body() user : User){
    if(await this.authService.validateUser(user.nickname, user.pwd))
      return await this.authService.login(user);
    else
      throw new UnauthorizedException();
  }

  @Post('register')
  @ApiOperation({ description: "Register a user" })
  @ApiCreatedResponse({
      description: "User register successful",
  })
  @ApiNotFoundResponse({
    description: "User not found",
})
  async register(@Body() user : User){
    const saltOrRounds = 10; //TODO
    user.pwd = await bcrypt.hash(user.pwd, saltOrRounds);
    const u = await this.userService.create(user);
    if(u){
      console.log(user)
      return await this.authService.login(user);
    }else
      throw new NotFoundException();
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  async logout(@Req() req) {
    return req.user;
  }
}
