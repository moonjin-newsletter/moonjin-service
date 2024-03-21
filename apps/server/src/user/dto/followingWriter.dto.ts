import {WriterInfoDto} from "../../auth/dto";
import {UserIdentityDto} from "./userIdentity.dto";

export interface FollowingWriterDto {
    user : UserIdentityDto;
    writer : WriterInfoDto;
    following : {
        createdAt : Date;
    }
}