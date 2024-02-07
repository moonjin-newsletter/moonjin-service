"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import * as I from "components/icons";
import * as Fi from "react-icons/fi";
import { usePathname } from "next/navigation";
import csr from "../../lib/fetcher/csr";
import toast from "react-hot-toast";

export default function Header() {
  const userCookie = getCookie("accessToken");
  const path = usePathname();
  const [isLogin, setIsLogin] = useState(false);

  function onClickLogout() {
    csr
      .post("auth/logout")
      .then((res) => {
        toast.success("로그아웃 완료");
        setIsLogin(false);
      })
      .catch((err) => {
        toast.error("로그아웃 실패!");
      });
  }

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
        <div className="flex h-full items-center">
          {isLogin ? (
            <div className="w-fit h-full flex items-center gap-x-3 relative text-white">
              <Link
                href=""
                className="border border-white text-sm py-1.5 px-2.5 rounded-full"
              >
                시작하기
              </Link>
              <button className="h-full px-2.5 relative  text-white peer">
                <I.User width="22" height="23" viewBox="0 0 24 25" />
              </button>
              <nav className="absolute bg-black/80 bortder rounded-lg overflow-hidden font-medium text-[15px] text-grayscale-100 h-fit w-fit hidden flex-col whitespace-nowrap right-0 top-14 hover:flex peer-hover:flex ">
                <Link className=" py-2 px-3" href="">
                  마이페이지
                </Link>

                <button onClick={onClickLogout} className="py-2 px-3">
                  로그아웃
                </button>
              </nav>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="py-2.5 h-fit px-6 text-white text-sm bg-[#7b0000] rounded-lg"
            >
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
