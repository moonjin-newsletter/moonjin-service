"use client";
import Link from "next/link";
import Image from "next/image";

import type { SubscribingWriterProfileDto } from "@moonjin/api-types";
import { format } from "date-fns";
import csr from "../../../lib/fetcher/csr";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function WriterCard({
  writerInfo,
}: {
  writerInfo: SubscribingWriterProfileDto;
}) {
  const router = useRouter();
  function deleteSubscribe(writerId: number) {
    return csr.delete(`subscribe/${writerId}`).then((res) => {
      toast.success("구독목록에서 삭제됐습니다");
    });
  }

  return (
    <div className="group w-full flex flex-col p-4 border-b border-grayscale-200">
      <Link
        className="w-full flex items-center"
        href={`/@${writerInfo.writerInfo.moonjinId}`}
      >
        <Image
          src={writerInfo.user.image}
          alt="작가 프로필 이미지"
          width={48}
          height={48}
          className="w-12 h-12 rounded-full bg-grayscale-400 object-contain"
        />
        <div className="flex flex-col ml-3">
          <p className="font-semibold">{writerInfo.user.nickname}</p>
          <p className="line-clamp-1">{writerInfo.user.description}</p>
        </div>
        <div className="flex whitespace-nowrap flex-col ml-auto pl-4 gap-y-1">
          <div className="flex text-sm text-grayscale-500">
            {format(new Date(writerInfo.following.createdAt), "yyyy-MM-dd")}부터
            구독
          </div>
          <div className="flex gap-x-1 items-center text-sm text-grayscale-500">
            <p>총 게시물 : {writerInfo.writerInfo.newsletterCount}</p>
            <div className="w-[1px] h-3 bg-grayscale-400" />
            <p>총 시리즈 : {writerInfo.writerInfo.newsletterCount}</p>
          </div>
        </div>
      </Link>
      <div className="w-full">
        <button
          onClick={async () => {
            await deleteSubscribe(writerInfo.user.id);
            router.refresh();
          }}
          className="mt-2 py-2 text-sm px-4 bg-grayscale-600 text-white rounded-lg ml-auto group-hover:flex hidden"
        >
          구독취소
        </button>
      </div>
    </div>
  );
}
