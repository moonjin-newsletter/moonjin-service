import type { Format } from "typia/lib/tags/Format";
import type { MaxLength } from "typia/lib/tags/MaxLength";
export type ICheckEmailExist = {
    email: (string & Format<"email"> & MaxLength<32>);
};
