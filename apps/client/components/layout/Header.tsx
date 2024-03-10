"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import * as Fi from "react-icons/fi";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";
import * as I from "components/icons";
import csr from "../../lib/fetcher/csr";
import { useRouter } from "next/navigation";

export default function Header() {
  const userCookie = getCookie("accessToken");
  const path = usePathname();
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(false);

  function onClickLogout() {
    csr
      .post("auth/logout")
      .then((res) => {
        setIsLogin(false);
        return router.push("/");
      })
      .catch((err) => {
        toast.error("로그아웃 실패!");
      });
  }

  useEffect(() => {
    userCookie ? setIsLogin(true) : setIsLogin(false);
  }, [userCookie]);

  if (
    path.includes("login") ||
    path.includes("signup") ||
    path.includes("auth/social")
  )
    return null;
  return (
    <header className="fixed z-50 top-0 left-0 w-full flex h-16  items-center justify-center bg-black/40">
      <div className="flex  w-[1006px] h-full items-center  font-normal">
        <Link className="flex  items-center h-full text-white" href="/">
          <I.Logo height="29" viewBox="0 0 149 39" width="139" />
        </Link>
        <div className="flex h-full ml-72 gap-x-8 items-center text-white">
          <Link className="flex items-center  h-full" href="">
            Brand
          </Link>
          <Link className="flex items-center  h-full" href="">
            시리즈
          </Link>
          <Link className="flex items-center  h-full" href="">
            전체 뉴스레터
          </Link>
        </div>
        <div className="flex h-full items-center ml-auto">
          {isLogin ? (
            <div className="w-fit h-full flex items-center gap-x-4 relative text-white">
              <Link
                className="border border-white text-sm py-1.5 px-2.5 rounded-full"
                href=""
              >
                시작하기
              </Link>
              <div className="h-fit group flex  bg-black/50 rounded-l-full rounded-r-full items-center">
                <nav className=" items-center transition duration-300 ease-in-out   overflow-hidden font-medium text-[15px] text-grayscale-100 h-full  w-fit hidden  whitespace-nowrap  hover:flex group-hover:flex ">
                  <Link className=" py-1.5 px-4" href="/mypage">
                    마이페이지
                  </Link>

                  <button className="py-2 px-3" onClick={onClickLogout}>
                    로그아웃
                  </button>
                </nav>
                <button className="h-full px-2.5 py-2.5 relative  text-white ">
                  <I.User height="23" viewBox="0 0 24 25" width="22" />
                </button>
              </div>

              {/*<nav className="absolute bg-black/80 bortder rounded-lg overflow-hidden font-medium text-[15px] text-grayscale-100 h-fit w-fit hidden flex-col whitespace-nowrap right-0 top-14 hover:flex peer-hover:flex ">*/}
              {/*  <Link className=" py-2 px-3" href="">*/}
              {/*    마이페이지*/}
              {/*  </Link>*/}

              {/*  <button onClick={onClickLogout} className="py-2 px-3">*/}
              {/*    로그아웃*/}
              {/*  </button>*/}
              {/*</nav>*/}
            </div>
          ) : (
            <Link
              className="py-2.5 h-fit px-6 text-white text-sm bg-[#7b0000] rounded-lg"
              href="/auth/login"
            >
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
