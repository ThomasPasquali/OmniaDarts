import { Module } from "@nestjs/common";
import { TextchatsGateway } from './textchats.gateway';

@Module({
    providers: [TextchatsGateway]
})
export class TextchatsModule {}