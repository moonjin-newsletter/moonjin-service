"use client";

import Image from "next/image";
import Link from "next/link";
import type { SeriesDto } from "@moonjin/api-types";
import csr from "@lib/fetcher/csr";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function SeriesProfile({
  seriesId,
  seriesInfo,
}: {
  seriesId: number;
  seriesInfo: SeriesDto;
}) {
  const router = useRouter();

  function onClickDelete() {
    csr
      .delete(`series/${seriesId}`)
      .then((res) => router.push("/mypage/newsletter/publish"))
      .catch(() => toast.error("빈 시리즈만 삭제 가능"));
  }

  return (
    <section className="flex mt-4 flex-col w-full p-5 bg-grayscale-100 rounded-lg">
      <div className="flex gap-x-2.5">
        <Image
          src={seriesInfo.cover}
          width={128}
          height={128}
          alt="시리즈 이미지"
          className="bg-grayscale-400 min-w-[128px] w-32 h-32 rounded-lg"
        />
        <div className="w-full flex flex-col">
          <div className="flex items-center">
            <h1 className="text-lg font-semibold text-grayscale-700">
              {seriesInfo.title}
            </h1>
            <button
              onClick={onClickDelete}
              className="py-1 ml-auto px-2.5 bg-grayscale-600 text-white rounded"
            >
              삭제
            </button>
            <Link
              href={`/mypage/newsletter/series/${seriesId}/edit`}
              className="py-1 ml-1 px-2.5 bg-primary text-white rounded"
            >
              수정
            </Link>
          </div>
          <div className="text-sm mt-2 text-grayscale-500">
            #{seriesInfo.category}
          </div>
          <div className="text-sm mt-2 text-grayscale-500">
            {seriesInfo.description}
          </div>
        </div>
      </div>
      <Link
        href={`/write/new?seriesId=${seriesId}`}
        className="mt-4 w-full font-medium bg-primary py-2 text-white rounded flex items-center justify-center"
      >
        글 작성하기
      </Link>
    </section>
  );
}
