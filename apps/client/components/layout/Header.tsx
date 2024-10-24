"use client";
import Link from "next/link";
import toast from "react-hot-toast";
import * as I from "components/icons";
import csr from "../../lib/fetcher/csr";
import { usePathname, useRouter } from "next/navigation";
import useSWR from "swr";
import { checkType } from "@utils/checkUser";
import useScroll from "@utils/hooks/useScroll";
import type { ResponseForm, UserOrWriterDto } from "@moonjin/api-types";

export default function Header({
  initialColor = "bg-transparent",
  initialBorder = "border-none",
}: {
  initialColor?: string;
  initialBorder?: string;
}) {
  const {
    data: userInfo,
    isLoading,
    mutate,
  } = useSWR<ResponseForm<UserOrWriterDto>>("user");
  const router = useRouter();
  const pathname = usePathname();
  const scroll = useScroll();

  function onClickLogout() {
    csr
      .post("auth/logout")
      .then((res) => {
        router.push("/");
        return mutate(undefined);
      })
      .catch((err) => {
        toast.error("로그아웃 실패");
      });
  }

  return (
    <header
      className={`${
        scroll.y === 0
          ? initialBorder + " " + initialColor
          : "bg-white/90 border-b"
      }  transition duration-300 fixed z-50 top-0 left-0 w-full flex h-16  items-center justify-center  border-grayscale-200`}
    >
      <div className="flex w-[1006px] h-full items-center  font-normal">
        <Link className="flex  items-center h-full text-white" href="/">
          <I.Logo
            className="text-primary"
            height="29"
            viewBox="0 0 149 39"
            width="139"
          />
        </Link>
        <div className="flex h-full text-sm font-medium ml-10 gap-x-8 items-center text-grayscale-600">
          {/*<Link*/}
          {/*  className={`${*/}
          {/*    pathname === "/about" && "text-primary"*/}
          {/*  } flex items-center  h-full`}*/}
          {/*  href="/about"*/}
          {/*>*/}
          {/*  소개하기*/}
          {/*</Link>*/}
          <Link
            className={`${
              pathname === "/series" && "text-primary"
            } flex items-center  h-full hover:font-semibold`}
            href="/series"
          >
            시리즈 뉴스레터
          </Link>
          <Link
            className={`${
              pathname === "/newsletter" && "text-primary"
            } flex items-center  h-full hover:font-semibold`}
            href="/newsletter"
          >
            전체 뉴스레터
          </Link>
        </div>

        <div className="flex h-full items-center ml-auto">
          {isLoading ? (
            <LoadingUI />
          ) : userInfo ? (
            <div className="w-fit h-full   items-center flex  relative text-grayscale-600">
              <Link
                className="border gap-x-2 flex items-center border-grayscale-600 text-sm font-medium py-2 px-3 mx-3 rounded-full"
                href={
                  checkType(userInfo?.data?.user?.role) === "작가"
                    ? "/write/new"
                    : "auth/apply"
                }
              >
                <I.PencilSimpleLine />
                시작하기
              </Link>
              <div className="h-fit gap-x-4 px-4 group  flex  bg-transparent hover:bg-black/80 rounded-full  items-center">
                <nav className=" items-center  gap-x-4 text-sm font-medium transition duration-300 ease-in-out   overflow-hidden  text-grayscale-100 h-full  w-fit hidden  whitespace-nowrap  hover:flex group-hover:flex ">
                  {checkType(userInfo?.data?.user?.role) === "작가" && (
                    <Link
                      className="py-1.5 "
                      href={`/@${userInfo?.data?.writerInfo?.moonjinId}`}
                    >
                      작가의 서재
                    </Link>
                  )}

                  <Link className=" py-1.5 " href="/mypage">
                    마이페이지
                  </Link>
                </nav>
                <button className="h-full  py-2.5 relative  text-white ">
                  <I.User
                    className={`fill-grayscale-600 group-hover:fill-white`}
                    height="23"
                    viewBox="0 0 24 25"
                    width="22"
                  />
                </button>
              </div>
              <button className="py-2.5 px-3" onClick={onClickLogout}>
                <I.SignOut />
              </button>
            </div>
          ) : (
            <Link
              className="py-2.5 h-fit px-5 text-white text-sm bg-primary rounded-lg"
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

function LoadingUI() {
  return (
    <div className="flex animate-pulse items-center gap-x-5 mr-2">
      <div className="rounded-full bg-grayscale-100 h-8 w-24" />
      <div className="rounded-full bg-grayscale-100 size-10" />
      <div className="rounded-full bg-grayscale-100 size-10" />
    </div>
  );
}
