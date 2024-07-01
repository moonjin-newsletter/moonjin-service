import { match } from "ts-pattern";
import type { ResponseForm, UserDto, WriterDto } from "@moonjin/api-types";

export type userType = "작가" | "독자";

export function checkType(level: number) {
  return match(level)
    .returnType<userType>()
    .with(0, () => "독자")
    .with(1, () => "작가")
    .with(2, () => "작가")
    .otherwise(() => "독자");
}

// user의 경우
type UserResponse = ResponseForm<{ user: UserDto }>;
// writer의 경우
type WriterResponse = ResponseForm<WriterDto>;
// 가능한 응답 타입
type UserInfo = UserResponse | WriterResponse;
//타입가드 함수
export function isWriterResponse(
  response: UserInfo,
): response is WriterResponse {
  return (response as WriterResponse).data?.writerInfo.moonjinId !== undefined;
}
