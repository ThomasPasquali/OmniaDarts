import { Module } from "@nestjs/common";
import { TextchatsGateway } from './textchats.gateway';
import {EventsModule} from "../events/events.module";
import {UsersModule} from "../users/users.module";
import {AuthModule} from "../auth/auth.module";

@Module({
    imports: [EventsModule, UsersModule, AuthModule],
    providers: [TextchatsGateway]
})
export class TextchatsModule {}