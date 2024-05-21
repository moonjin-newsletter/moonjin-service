import { match } from "ts-pattern";
import { userType } from "../app/mypage/layout";

export function userType(level: number) {
  return match(level)
    .returnType<userType>()
    .with(0, () => "독자")
    .with(1, () => "작가")
    .with(2, () => "작가")
    .otherwise(() => "독자");
}
