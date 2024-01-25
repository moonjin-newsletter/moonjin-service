"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import * as I from "components/icons";
import { usePathname } from "next/navigation";

export default function Header() {
  const userCookie = getCookie("accessToken");
  const path = usePathname();
  const [isLogin, setIsLogin] = useState(false);

  console.log(path);
  useEffect(() => {
    userCookie ? setIsLogin(true) : setIsLogin(false);
  }, [userCookie]);

  if (
    path.includes("login") ||
    path.includes("signup") ||
    path.includes("auth/social")
  )
    return;
  return (
    <header className="fixed z-50 top-0 left-0 w-full flex h-16  items-center justify-center bg-black/40">
      <div className="flex  w-[1024px] h-full items-center justify-between font-normal">
        <Link href="/" className="flex items-center h-full text-white">
          <I.Logo width="139" height="29" viewBox="0 0 149 39" />
        </Link>
        <div className="flex h-full gap-x-8 items-center text-white">
          <Link href="" className="flex items-center  h-full">
            Brand
          </Link>
          <Link href="" className="flex items-center  h-full">
            시리즈
          </Link>
          <Link href="" className="flex items-center  h-full">
            전체 뉴스레터
          </Link>
        </div>
        <div className="flex ">
          {isLogin ? (
            <button className="py-2.5 px-6 text-white text-sm bg-[#7b0000] rounded-lg">
              유저
            </button>
          ) : (
            <Link
              href="/auth/login"
              className="py-2.5 px-6 text-white text-sm bg-[#7b0000] rounded-lg"
            >
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
