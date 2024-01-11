import {tags} from "typia";

export interface ISocialSignup {
    nickname: string & tags.MinLength<2> & tags.MaxLength<16>;
    role: number & tags.Minimum<0> & tags.Maximum<1>;
    moonjinEmail?: string & tags.Format<"email"> & tags.MaxLength<32>;
}
