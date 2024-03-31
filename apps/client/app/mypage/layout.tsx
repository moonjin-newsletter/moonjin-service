import React, { ReactElement, ReactNode } from "react";
import { notFound, redirect } from "next/navigation";
import { match } from "ts-pattern";
import ssr from "../../lib/fetcher/ssr";
import { Sidebar } from "./_components/Sidebar";
import Profile from "./_components/Profile";

export type userType = "작가" | "독자" | "";

type userInfoType = any & { data: { user: { role: number } } };

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const userInfo = await ssr("user")
    .json<userInfoType>()
    .catch((err) => redirect("/auth/login"));

  if (!userInfo) notFound();

  const type = match<number, userType>(userInfo.data.user.role ?? 0)
    .returnType<userType>()
    .with(0, () => "독자")
    .with(1, () => "작가")
    .otherwise(() => "");

  return (
    <div className="flex   w-full items-center flex-col bg-white p-0 outline-none ">
      <section className="h-52 w-full bg-[#F7F7F7]" />
      <Profile type={type} userInfo={userInfo.data} />
      <section className="max-w-[1006px] w-full mt-14 flex gap-x-10 pb-12 ">
        <Sidebar type={type} />
        <div className="w-full flex flex-col ">{children}</div>
      </section>
    </div>
  );
}
