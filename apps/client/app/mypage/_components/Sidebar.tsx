"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";
import { userType } from "@utils/checkUser";

export function Sidebar({ role }: { role: userType }) {
  return (
    <nav className="flex flex-col w-[200px] min-w-[200px]">
      <Link
        className="w-full mb-8 font-medium text-white justify-center flex  py-4 bg-primary  rounded-lg"
        href={role === "작가" ? "/write/new" : "/auth/apply"}
      >
        {role === "작가" ? "뉴스레터 작성하기" : "작가로 시작하기"}
      </Link>

      <div className="flex flex-col w-full ">
        <MenuLink title="마이페이지 홈" url="/mypage" />
        {role === "작가" && (
          <div className="flex flex-col w-full ">
            {[
              {
                title: "작성중인 글",
                icon: null,
                url: "/mypage/newsletter/prepare",
              },
              {
                title: "발행한 뉴스레터",
                icon: null,
                url: "/mypage/newsletter/publish",
              },
              { title: "구독자 관리", icon: null, url: "/mypage/follower" },
            ].map((value, index) => (
              <MenuLink key={index} title={value.title} url={value.url} />
            ))}
            <div className="w-full h-5 bg-grayscale-100" />
          </div>
        )}
        <MenuLink title="구독한 뉴스레터" url="/mypage/subscribe" />
        <MenuLink title="구독한 작가" url="/mypage/following" />
        {/*<MenuLink title="문진 스탬프" url="/mypage/stamp" />*/}
        {/*<MenuLink title="편지함" url="/mypage/letter" />*/}
        <MenuLink title="프로필 설정" url="/mypage/setting" />
      </div>
      {/*<div className="w-full mt-2">*/}
      {/*  <button className="w-full   flex justify-center items-center py-4 text-rose-500">*/}
      {/*    로그아웃*/}
      {/*  </button>*/}
      {/*</div>*/}
    </nav>
  );
}

function MenuLink({
  title,
  url,
  icon,
}: {
  title: string;
  url: string;
  icon?: HTMLElement;
}) {
  const nowUrl = usePathname();

  return (
    <Link
      className={`
      ${
        url === nowUrl
          ? "text-primary"
          : "text-grayscale-500 hover:text-grayscale-700"
      }
      hover:bg-grayscale-300  py-4 px-5 text-grayscale-500  font-medium  w-full border-b  border-grayscale-200`}
      href={url}
    >
      {title}
    </Link>
  );
}
