import Link from "next/link";
import * as I from "components/icons";
import ssr from "../../../../lib/fetcher/ssr";
import type { LetterWithUserDto, ResponseForm } from "@moonjin/api-types";
import LetterTab from "./_components/LetterTab";

const dummy = [
  {
    id: 1,
    receiverId: 1,
    title: "test편지",
    content:
      "이것은 편지입니다. 이것은 편지입니다. 이것은 편지입니다. 이것은 편지입니다. 이것은 편지입니다.",
    createdAt: new Date(),
    readAt: null,
    sender: {
      id: 3,
      nickname: "윤킴",
    },
  },
  {
    id: 1,
    receiverId: 1,
    title: "행복해요",
    content:
      "이것은 편지입니다. 이것은 편지입니다. 이것은 편지입니다. 이것은 편지입니다. 이것은 편지입니다.",
    createdAt: new Date(),
    readAt: null,
    sender: {
      id: 3,
      nickname: "윤킴",
    },
  },
  {
    id: 1,
    receiverId: 1,
    title: "고맙습니다",
    content:
      "이것은 편지입니다. 이것은 편지입니다. 이것은 편지입니다. 이것은 편지입니다. 이것은 편지입니다.",
    createdAt: new Date(),
    readAt: null,
    sender: {
      id: 3,
      nickname: "윤킴",
    },
  },
];

export default async function Page() {
  const { data: receivedLetter } = await ssr("letter/receive").then((res) =>
    res.json<ResponseForm<LetterWithUserDto[]>>(),
  );
  const { data: sendingLetter } = await ssr("letter/send").then((res) =>
    res.json<ResponseForm<LetterWithUserDto[]>>(),
  );

  return (
    <main className="overflow-hidden w-full max-w-[748px]">
      <LetterTab
        receivedLetter={receivedLetter}
        sendingLetter={sendingLetter}
      />
    </main>
  );
}
