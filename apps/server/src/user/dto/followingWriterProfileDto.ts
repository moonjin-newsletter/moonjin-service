import {WriterProfileDto} from "./writerProfile.dto";

export interface FollowingWriterProfileDto extends WriterProfileDto{
    following : {
        createdAt : Date;
    }
}