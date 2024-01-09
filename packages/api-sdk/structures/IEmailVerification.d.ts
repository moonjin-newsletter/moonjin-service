import type { MaxLength } from "typia/lib/tags/MaxLength";
export type IEmailVerification = {
    code: (string & MaxLength<64>);
};
