"use client";

import type { WriterPublicCardDto } from "@moonjin/api-types";

export default function WriterInfoModal({
  unmount,
  writerInfo,
}: {
  unmount: any;
  writerInfo: WriterPublicCardDto;
}) {
  return (
    <div
      onClick={(e) => {
        unmount();
      }}
      className="fixed  top-0 flex items-center justify-center z-50 w-screen h-screen bg-black/40"
    >
      <section className=" h-fit min-w-[520px] w-[540px] overflow-y-auto py-8 px-10 rounded-lg bg-white">
        <div className="w-full flex">
          <span className="text-xl font-bold">작가정보</span>
        </div>
      </section>
    </div>
  );
}
