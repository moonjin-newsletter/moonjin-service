import Link from "next/link";
import Image from "next/image";
import type { FollowingWriterDto } from "@moonjin/api-types";
import { format } from "date-fns";

export default function WriterCard({
  writerInfo,
}: {
  writerInfo: FollowingWriterDto;
}) {
  return (
    <Link href={``} className="w-full flex p-4">
      <Image
        src={``}
        alt="작가 프로필 이미지"
        className="w-12 h-12 rounded-full bg-grayscale-400 object-contain"
      />
      <div className="flex flex-col ml-3">
        <h3 className="font-semibold">{writerInfo.user.nickname}</h3>
        <span>{writerInfo.writer.description}</span>
      </div>
      <div className="flex flex-col ml-auto gap-y-3">
        <p className="text-grayscale-500 text-sm">
          {format(new Date(writerInfo.following.createdAt), "yyyy-MM-dd")}부터
          구독
        </p>
        <div className="flex gap-x-1 items-center text-sm text-grayscale-500">
          <p>총 게시물 : {writerInfo.writer.newsletterCount}</p>
          <div className="w-[1px] h-3 bg-grayscale-400" />
          <p>총 시리즈 : {writerInfo.writer.newsletterCount}</p>
        </div>
      </div>
    </Link>
  );
}
