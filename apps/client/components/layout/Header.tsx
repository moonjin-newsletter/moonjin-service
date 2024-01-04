"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import LoginModal from "../auth/LoginModal";

import { usePathname } from "next/navigation";

export default function Header() {
  const pathName = usePathname();
  const [isActive, setIsActive] = useState<boolean>(false);

  useEffect(() => {
    setIsActive(false);
  }, [pathName]);

  return (
    <header className="sticky top-0 left-0 w-full flex h-16  items-center justify-center bg-white/10">
      <div className="flex  w-[1024px] h-full items-center justify-between">
        <Link href="/" className="flex items-center h-full">
          <h1>Moonjin</h1>
        </Link>
        <div className="flex h-full gap-x-4 items-center">
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
          <button
            onClick={() => setIsActive((prevState) => !prevState)}
            className="py-2.5 px-6 text-white text-sm bg-[#7b0000] rounded-lg"
          >
            로그인
          </button>
        </div>
      </div>
      {isActive ? <LoginModal setIsActive={setIsActive} /> : null}
    </header>
  );
}
