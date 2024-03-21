import { FollowerDto, ExternalFollowerDto } from ".";

export interface AllFollowerDto {
    followerList : FollowerDto[];
    externalFollowerList : ExternalFollowerDto[];
}