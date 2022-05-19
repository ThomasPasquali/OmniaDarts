import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '../../schemas/user.schema';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  @ApiOperation({ description: 'Create a new user' })
  @ApiCreatedResponse({
    description: 'A new user has been created',
    type: User,
  })
  async createUser(@Body() user: User, @Res() response) {
    const newUser = await this.userService.create(user);
    return response.status(HttpStatus.CREATED).json(newUser);
  }

  @Get()
  @ApiOperation({ description: 'Get all users' })
  @ApiOkResponse({ type: [User] })
  async fetchAll(@Res() response) {
    const users = await this.userService.findAll();
    return response.status(HttpStatus.OK).json(users);
  }

  @Get(':id')
  @ApiOperation({ description: 'Get a user by id' })
  @ApiOkResponse({ type: User })
  async findById(@Res() response, @Param('id') id: string) {
    const user = await this.userService.findById(id);
    return response.status(HttpStatus.OK).json(user);
  }

  @Put(':id')
  @ApiOperation({ description: 'Update a user' })
  @ApiOkResponse({ type: User })
  async update(@Res() response, @Param('id') id: string, @Body() user: User) {
    const updatedUser = await this.userService.update(id, user);
    return response.status(HttpStatus.OK).json(updatedUser);
  }

  @Delete(':id')
  @ApiOperation({ description: 'Delete a user by id' })
  @ApiOkResponse({ type: User })
  async delete(@Res() response, @Param('id') id: string) {
    const deletedUser = await this.userService.delete(id);
    return response.status(HttpStatus.OK).json(deletedUser);
  }
}
