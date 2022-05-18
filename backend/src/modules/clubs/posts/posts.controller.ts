import {
  Body,
  Controller, Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ClubsService } from '../clubs.service';
import { UsersService } from '../../users/users.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { Club } from '../../../schemas/club.schema';
import ClubRequest from '../../../classes/clubRequest';
import {
  CheckPolicies,
  PoliciesGuard,
} from '../../casl/policies-guard.service';
import { AppAbility } from '../../casl/casl-ability.factory';
import { Action } from '../../casl/actions';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import ClubPost from '../../../classes/post';
import { User } from '../../../schemas/user.schema';
import {join} from "path";

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
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('postImage'))
  @ApiOperation({ description: 'Create a post for user s club' })
  @ApiCreatedResponse({ description: 'Post', type: Club })
  async createPost(
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
    @Body('title') title: string,
    @Body('message') message: string,
  ) {
    const club: Club = await this.clubsService.getClubById(req.user.club._id);
    //const filename = club._id + '_' + new Date().getTime().toString();

    const post: ClubPost = new ClubPost();
    post.title = title;
    post.message = message;
    console.log(file.filename);
    post.fileRelativeUri = join(
      this.configService.get<string>('FOLDER_POST_IMAGES').replace('./static', ''),
      file.filename,
    );

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
  @UseInterceptors(FileInterceptor('postImage'))
  @ApiOperation({ description: 'Request all post in a club' })
  @ApiCreatedResponse({ description: 'Post', type: [Post] })
  async getAllPostsOfMyClub(@Req() req){
    const club: Club = await this.clubsService.getClubById(req.user.club._id);
    return club.posts;
  }
}
