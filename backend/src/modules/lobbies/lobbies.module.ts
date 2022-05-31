import {forwardRef, Module} from '@nestjs/common';
import {MongooseModule} from "@nestjs/mongoose";
import {Match, MatchSchema} from "../../schemas/match.schema";
import {UsersModule} from "../users/users.module";
import {LobbiesService} from "./lobbies.service";
import {LobbiesGateway} from "./lobbies.gateway";
import {AuthModule} from "../auth/auth.module";
import {ClubsModule} from "../clubs/clubs.module";
import {ChatsModule} from "../chats/chats.module";
import {FriendRequestsService} from "../friendRequests/friendRequests.service";
import {MatchesModule} from "../matches/matches.module";
import {FriendRequestsModule} from "../friendRequests/friendRequests.module";

@Module({
    imports: [
        UsersModule,
        AuthModule,
        FriendRequestsModule,
        forwardRef(() => MatchesModule),
        forwardRef(() => ClubsModule),
        forwardRef(() => ChatsModule),
        MongooseModule.forFeature([{ name: Match.name, schema: MatchSchema }])
    ],
    providers: [LobbiesGateway, LobbiesService],
    controllers: [],
    exports: [LobbiesService],
})
export class LobbiesModule {}
