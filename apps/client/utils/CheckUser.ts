import { match } from "ts-pattern";

export type userType = "작가" | "독자";

export function checkType(level: number) {
  return match(level)
    .returnType<userType>()
    .with(0, () => "독자")
    .with(1, () => "작가")
    .with(2, () => "작가")
    .otherwise(() => "독자");
}
