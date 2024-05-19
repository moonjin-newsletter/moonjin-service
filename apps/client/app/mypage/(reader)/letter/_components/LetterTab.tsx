"use client";

import { Tab } from "@headlessui/react";
import { Fragment } from "react";
import { LetterWithUserDto } from "@moonjin/api-types";
import Link from "next/link";
import * as I from "../../../../../components/icons";
import { isNonEmptyArray } from "@toss/utils";
import { format } from "date-fns";

export default function LetterTab({
  receivedLetter,
  sendingLetter,
}: {
  receivedLetter: LetterWithUserDto[];
  sendingLetter: LetterWithUserDto[];
}) {
  return (
    <Tab.Group>
      <Tab.List className="w-full flex gap-x-4">
        {["받은 편지함", "보낸 편지함"].map((category, index) => (
          <Tab key={index} as={Fragment}>
            {({ selected }) => (
              /* Use the `selected` state to conditionally style the selected tab. */
              <button
                className={`${
                  selected ? "border-b-2 font-semibold" : null
                } border-primary py-1 outline-none`}
              >
                {category}
              </button>
            )}
          </Tab>
        ))}
        <Link
          href="/mypage/letter/sending"
          className="ml-auto py-1.5 px-4 bg-primary text-white text-sm rounded"
        >
          편지쓰기
        </Link>
      </Tab.List>
      <Tab.Panels className="w-full mt-4">
        <Tab.Panel>
          {isNonEmptyArray(receivedLetter ?? []) ? (
            receivedLetter?.map((letter, index) => (
              <ReceivedLetterCard key={index} letter={letter} />
            ))
          ) : (
            <div className="w-full flex flex-col gap-y-4 items-center justify-center py-12">
              <I.Empty />
              <span className="text-grayscale-500 ">
                아직 작성된 글이 없습니다
              </span>
            </div>
          )}
        </Tab.Panel>
        <Tab.Panel>
          {isNonEmptyArray(sendingLetter ?? []) ? (
            sendingLetter?.map((letter, index) => (
              <SendLetterCard key={index} letter={letter} />
            ))
          ) : (
            <div className="w-full flex flex-col gap-y-4 items-center justify-center py-12">
              <I.Empty />
              <span className="text-grayscale-500 ">
                아직 작성된 글이 없습니다
              </span>
            </div>
          )}
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  );
}

function SendLetterCard({ letter }: { letter: LetterWithUserDto }) {
  return (
    <Link
      href={`/mypage/letter/send-${letter.id}`}
      className={`flex flex-col w-full border-b border-grayscale-200 py-4 hover:bg-grayscale-700/20 rounded`}
    >
      <div className="w-full flex items-center ">
        <I.LetterOut />
        <p className="ml-2.5 font-semibold text-grayscale-700">
          {letter.title}
        </p>
        <span className="ml-2 text-sm text-grayscale-500">
          to.{letter.sender.nickname}
        </span>
        <span className="ml-auto text-sm text-grayscale-500">
          {format(new Date(letter.createdAt), "yyyy-MM-dd")}
        </span>
      </div>
      <div className="mt-4">
        <p className="text-sm text-grayscale-500">{letter.content}</p>
      </div>
    </Link>
  );
}

function ReceivedLetterCard({ letter }: { letter: LetterWithUserDto }) {
  return (
    <Link
      href={`/mypage/letter/receive-${letter.id}`}
      className={`${
        letter.readAt ? "bg-grayscale-500/10" : "bg-white"
      } flex flex-col w-full border-b border-grayscale-200 py-4 hover:bg-grayscale-700/10 rounded`}
    >
      <div className="w-full flex items-center ">
        <I.LetterIn />
        <p className="ml-2.5 font-semibold text-grayscale-700">
          {letter.title}
        </p>
        <span className="ml-2 text-sm text-grayscale-500">
          from.{letter.sender.nickname}
        </span>
        <span className="ml-auto text-sm text-grayscale-500">
          {format(new Date(letter.createdAt), "yyyy-MM-dd")}
        </span>
      </div>
      <div className="mt-4">
        <p className="text-sm text-grayscale-500">{letter.content}</p>
      </div>
    </Link>
  );
}
