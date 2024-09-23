import { Graphic2, Logo, LogoStrokeBlack } from "@components/icons";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="h-72 w-full bg-grayscale-600 flex items-center justify-center py-14">
      <section className="w-full max-w-[1006px] flex h-full justify-between">
        <div className="flex flex-col w-fit h-full justify-between">
          <div className="flex items-center">
            <LogoStrokeBlack
              className="text-white"
              width="30"
              height="30"
              viewBox="0 0 40 40"
            />
            <Logo
              className="text-white"
              width="146"
              height="36"
              viewBox="0 0 149 39"
            />
          </div>
          <div className="flex flex-col text-grayscale-400 text-sm gap-y-1">
            {/*<p>*/}
            {/*  주소 : 서울특별시 강남구 테헤란로 427, 4층 (역삼동, 더플레이스)*/}
            {/*</p>*/}
            <p>대표자 : 김윤하</p>
            <p>Tel : 010-9105-2990</p>
            <p>Email : support@moonjin.site</p>
          </div>
        </div>
        <div className="flex flex-col w0fit h-full justify-between">
          <div className="flex items-center text-grayscale-300 gap-x-4 text-sm">
            <Link
              target={"_blank"}
              href="https://moonjin.notion.site/10a8d6d4b48880b6ba63dc497909a933"
            >
              이용약관
            </Link>
            <Link
              target={"_blank"}
              href="https://moonjin.notion.site/10a8d6d4b4888066b283d6ab924da055"
            >
              개인정보 처리방침
            </Link>
            {/*<Link href="">자주 묻는 질문</Link>*/}
            <Link href="">문의하기</Link>
          </div>
          <div className="">
            <div className="flex items-center gap-x-4">
              <Graphic2 />
              <p className="text-grayscale-300 text-sm">
                더 궁금하신게 있으신가요?
                <br />
                문의하기를 통해 문진에게 알려주세요
              </p>
            </div>

            {/*<p className="text-grayscale-400 text-sm text-center">*/}
            {/*  © 2021 Moonjin. All rights reserved.*/}
            {/*</p>*/}
          </div>
        </div>
      </section>
    </footer>
  );
}
