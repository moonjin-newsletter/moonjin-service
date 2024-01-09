import type { Format } from "typia/lib/tags/Format";
import type { MaxLength } from "typia/lib/tags/MaxLength";
import type { MinLength } from "typia/lib/tags/MinLength";
export type ILocalLogin = {
    email: (string & Format<"email"> & MaxLength<32>);
    password: (string & MinLength<4> & MaxLength<16>);
};
