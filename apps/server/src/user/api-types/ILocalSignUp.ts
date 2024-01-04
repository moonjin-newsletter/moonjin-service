import {tags} from "typia";

export interface ILocalSignUp {
    email: string & tags.Format<"email"> & tags.MaxLength<32>;
    password: string & tags.MinLength<4> & tags.MaxLength<16>;
    nickname: string & tags.MinLength<2> & tags.MaxLength<16>;
    role: number & tags.Minimum<0> & tags.Maximum<1>;
    moonjinEmail?: string & tags.Format<"email"> & tags.MaxLength<32>;
}
