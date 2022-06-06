import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOperation,
  ApiProperty,
  ApiPropertyOptional,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { User } from '../../schemas/user.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import ClubPost from '../../classes/post';

class updateUser {
  @ApiPropertyOptional() nickname: string;
  @ApiPropertyOptional() lastname: string;
  @ApiPropertyOptional() firstname: string;
  @ApiPropertyOptional() country: string;
  @ApiPropertyOptional({ type: 'string', format: 'binary' }) imageUrl: string;
}

@Controller('profile')
@ApiTags('profile')
export class ProfileController {
  constructor(
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  @Patch()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ description: 'Update a user profile' })
  @UseInterceptors(FileInterceptor('imageUrl'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Profile',
    type: updateUser,
  })
  @ApiCreatedResponse({
    description: "User's profile updated",
    type: updateUser,
  })
  async updateProfile(
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
    @Body('nickname') nickname: string,
    @Body('lastname') lastname: string,
    @Body('firstname') firstname: string,
    @Body('country') country: string,
  ) {
    const user = await this.userService.findById(req.user._id);
    user.nickname = nickname != null ? nickname : user.nickname;
    user.firstname = firstname != null ? firstname : user.firstname;
    user.lastname = lastname != null ? lastname : user.lastname;
    user.country = country != null ? country : user.country;
    if (file != null) {
      user.imageUrl = join(
        this.configService.get<string>('FOLDER_IMAGES').replace('./static', ''),
        file.filename,
      );
    }
    return await this.userService.update(user._id, user);
  }
}
