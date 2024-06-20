import {WriterProfileDto} from "../../writerInfo/dto";

export interface SubscribingWriterProfileDto extends WriterProfileDto{
    following : {
        createdAt : Date;
    }
}