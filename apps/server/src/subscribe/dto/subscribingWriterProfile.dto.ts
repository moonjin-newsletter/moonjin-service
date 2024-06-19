import {WriterProfileDto} from "../../writer/dto";

export interface SubscribingWriterProfileDto extends WriterProfileDto{
    following : {
        createdAt : Date;
    }
}