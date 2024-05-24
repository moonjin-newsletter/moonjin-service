import {WriterProfileDto} from "../../user/dto";

export interface SubscribingWriterProfileDto extends WriterProfileDto{
    following : {
        createdAt : Date;
    }
}