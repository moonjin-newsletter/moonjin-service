import React, { ReactElement, ReactNode } from "react";

export type userType = "작가" | "독자";

export default async function NoteLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex   w-full items-center flex-col bg-white p-0 outline-none ">
      <section className="max-w-[1006px] px-8 min-h-screen w-full mt-16 flex gap-x-10 pb-12 ">
        <div className="w-full flex flex-col   ">{children}</div>
      </section>
    </div>
  );
}
