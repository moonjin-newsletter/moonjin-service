import {tags} from "typia";

export interface IAddExternalUserFromForm{
    writerMoonjinId: string & tags.MinLength<2> & tags.MaxLength<32>;
    email: string & tags.Format<"email"> & tags.MaxLength<64>;
}