import { ApiProperty } from '@nestjs/swagger';
import {User} from "../schemas/user.schema";

export default class ClubPost {

    @ApiProperty()
    title: string;

    @ApiProperty()
    message: string;

    @ApiProperty()
    fileRelativeUri: string;

    @ApiProperty()
    user: User;

    @ApiProperty()
    dateTime: number;
}
