import type { Format } from "typia/lib/tags/Format";
import type { Maximum } from "typia/lib/tags/Maximum";
import type { MaxLength } from "typia/lib/tags/MaxLength";
import type { Minimum } from "typia/lib/tags/Minimum";
import type { MinLength } from "typia/lib/tags/MinLength";
export type ILocalSignUp = {
    email: (string & Format<"email"> & MaxLength<32>);
    password: (string & MinLength<4> & MaxLength<16>);
    nickname: (string & MinLength<2> & MaxLength<16>);
    role: (number & Minimum<0> & Maximum<1>);
};
