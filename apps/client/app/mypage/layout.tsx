import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { match } from "ts-pattern";
import ssr from "../../lib/fetcher/ssr";
import { Sidebar } from "./_components/Sidebar";
import Profile from "./_components/Profile";

export type userType = "작가" | "독자" | "";

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const userInfo = await ssr("user")
    .json<any>()
    .catch((err) => redirect("/auth/login"));
  console.log(userInfo);

  // const type = match(userInfo.data.user.role)
  //   .returnType<userType>()
  //   .with(0, () => "독자")
  //   .with(1, () => "작가")
  //   .otherwise(() => "");

  const type = "작가";

  return (
    <div className="flex  w-full items-center flex-col bg-white p-0 outline-none ">
      <section className="h-52 w-full bg-primary" />
      <Profile type={type} userInfo={userInfo.data.user} />
      <section className="max-w-[1006px] w-full flex bg-gray-100">
        <Sidebar type={type} />
        <div className="">{children}</div>
      </section>
    </div>
  );
}
