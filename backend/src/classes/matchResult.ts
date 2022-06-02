import {Prop} from "@nestjs/mongoose";
import mongoose from "mongoose";
import {ApiProperty} from "@nestjs/swagger";

export default class MatchResult {

    @Prop({ type: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, required: true })
    @ApiProperty({ required: true})
    userID: String;

    @Prop({ type: Number, required: true })
    @ApiProperty({ required: true})
    score: Number;

}