import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { join } from 'path';
import ClubPost from '../../../classes/post';
import { Club } from '../../../schemas/club.schema';
import { User } from '../../../schemas/user.schema';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { Action } from '../../casl/actions';
import { AppAbility } from '../../casl/casl-ability.factory';
import {
  CheckPolicies,
  PoliciesGuard,
} from '../../casl/policies-guard.service';
import { UsersService } from '../../users/users.service';
import { ClubsService } from '../clubs.service';
import ModResponse from '../../../classes/modResponse';

@Controller('posts')
@ApiTags('posts')
export class PostsController {
  constructor(
    private readonly clubsService: ClubsService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.CreatePost, Club))
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('postImage'))
  @ApiOperation({ description: 'Create a post for user s club' })
  @ApiCreatedResponse({ description: 'Post', type: Club })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Post',
    type: ClubPost,
  })
  @ApiResponse({ description: 'Error response structure', type: ModResponse })
  async createPost(
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
    @Body('title') title: string,
    @Body('message') message: string,
  ) {
    const club: Club = await this.clubsService.getClubById(req.user.club._id);

    const post: ClubPost = new ClubPost();
    post.title = title;
    post.message = message;
    if (file != null) {
      post.fileRelativeUri = join(
        this.configService.get<string>('FOLDER_IMAGES').replace('./static', ''),
        file.filename,
      );
    }

    post.user = {
      _id: req.user._id,
      nickname: req.user.nickname,
    } as User;

    post.dateTime = Date.now();

    club.posts.push(post);
    return await this.clubsService.update(club._id, club);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ description: 'Request all post in a club' })
  @ApiCreatedResponse({ description: 'Post', type: [Post] })
  async getAllPostsOfMyClub(@Req() req) {
    const club: Club = await this.clubsService.getClubById(req.user.club._id);
    return club.posts;
  }
}
