import React, { ReactElement, ReactNode } from "react";
import { notFound, redirect } from "next/navigation";

import ssr from "../../lib/fetcher/ssr";
import { Sidebar } from "./_components/Sidebar";
import Profile from "./_components/Profile";
import type { ResponseForm, UserDto, WriterDto } from "@moonjin/api-types";
import { checkType } from "@utils/CheckUser";

export default async function MypageLayout({
  children,
}: {
  children: ReactNode;
}) {
  const userInfo = await ssr("user")
    .json<ResponseForm<{ user: UserDto } | WriterDto>>()
    .catch((err) => redirect("/auth/login"));

  if (!userInfo?.data) notFound();
  const userRole = userInfo?.data?.user?.role ?? 0;

  const type = checkType(userRole);

  return (
    <div className="flex   w-full items-center flex-col bg-white p-0 outline-none ">
      <section className="h-52 w-full bg-grayscale-200" />
      <Profile type={type} userInfo={userInfo.data} />
      <section className="max-w-[1006px] w-full mt-14 flex gap-x-10 pb-12 ">
        <Sidebar type={type} />
        <div className="w-full flex flex-col ">{children}</div>
      </section>
    </div>
  );
}
