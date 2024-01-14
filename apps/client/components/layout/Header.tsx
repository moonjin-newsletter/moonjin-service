"use client";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";

export default function Header() {
  const userCookie = getCookie("accessToken");
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    userCookie ? setIsLogin(true) : setIsLogin(false);
  }, [userCookie]);

  return (
    <header className="fixed z-50 top-0 left-0 w-full flex h-16  items-center justify-center bg-black/40">
      <div className="flex  w-[1024px] h-full items-center justify-between font-normal">
        <Link href="/" className="flex items-center h-full text-white">
          <h1>Moonjin</h1>
        </Link>
        <div className="flex h-full gap-x-8 items-center text-white">
          <Link href="" className="flex items-center  h-full">
            Branding
          </Link>
          <Link href="" className="flex items-center  h-full">
            단편 뉴스레터
          </Link>
          <Link href="" className="flex items-center  h-full">
            장편 뉴스레터
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
