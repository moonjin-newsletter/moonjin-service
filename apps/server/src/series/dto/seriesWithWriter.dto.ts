import {UserIdentityDto} from "../../user/dto/userIdentity.dto";

export interface SeriesWithWriterDto {
    id : number;
    title: string;
    writer : UserIdentityDto;
    category : string;
    clicks : number;
    status : boolean;
    cover : string | null;
    description : string | null;
    releasedAt : Date | null;
}