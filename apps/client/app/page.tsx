import Image from "next/image";
import Background from "../public/images/background.png";
import CategoryTab from "./_components/CategoryTab";
import { postData } from "./_data";
import Link from "next/link";

export default function Page(): JSX.Element {
  return (
    <main className=" w-full min-h-screen  ">
      <div className="relative flex flex-col items-center justify-center w-full h-full min-h-screen">
        <section className="flex-1 w-full h-full min-h-screen bg-black">
          <Image
            className="absolute top-0 left-0 z-0 w-screen h-screen object-cover"
            src={Background}
            alt="백그라운드 이미지"
          />
        </section>
        <section className="flex pt-44 pb-32 flex-col  items-center w-full">
          <h4 className="text-gray-500 text-sm">
            문진만의 다양한 인기있는 뉴스레터들을 만나보세요
          </h4>
          <h2 className="font-libre mt-2 text-2xl font-bold text-grayscale-700">
            Moonjin Newsletter
          </h2>
          <div className="w-full mt-8 flex flex-col items-center text-sm">
            <CategoryTab
              tabList={["시・수필", "소설", "에세이", "평론", "기타"]}
              layout={
                <div className="mt-4 w-fit flex gap-x-1">
                  <Link
                    href=""
                    className="w-80 h-[450px] bg-gray-600 relative overflow-hidden"
                  >
                    <div className="absolute py-8 top-0 left-0 bg-black/60 z-10 text-white flex flex-col items-center w-full h-full px-12 hover:brightness-75 peer">
                      <span className="text-lg mt-auto font-bold leading-relaxed">
                        {postData[0].title}
                      </span>
                      <div className="text-sm text-grayscale-0/60">
                        By.{postData[0].writer}
                      </div>
                      <div className="text-sm text-grayscale-0/50 font-light">
                        {postData[0].createdAt}
                      </div>
                      <div className="font-semibold border-b border-white/80 py-1 mt-28">
                        바로가기
                      </div>
                    </div>

                    <Image
                      src={postData[0].thumbnail[0]}
                      width={320}
                      height={320}
                      alt="게시물이미지"
                      className="w-full h-full object-cover peer-hover:scale-105 transition duration-200 ease-in-out"
                    />
                  </Link>
                  <div className="w-60 h-[450px] overflow-hidden flex flex-col gap-y-1">
                    <Link
                      href=""
                      className="w-full h-1/2 bg-gray-600 relative overflow-hidden "
                    >
                      <div className="absolute py-8 top-0 left-0 bg-black/60  z-10 text-white flex flex-col items-center w-full h-full px-12 hover:brightness-75 peer">
                        <span className="text-lg mt-auto font-bold leading-relaxed">
                          {postData[1].title}
                        </span>
                        <div className="text-sm text-grayscale-0/60">
                          By.{postData[1].writer}
                        </div>
                        <div className="text-sm text-grayscale-0/50 font-light">
                          {postData[1].createdAt}
                        </div>
                        <div className="font-semibold border-b border-white/80 py-1  mt-2">
                          바로가기
                        </div>
                      </div>
                      <Image
                        src={postData[1].thumbnail[0]}
                        width={320}
                        height={320}
                        alt="게시물이미지"
                        className="w-full h-full object-cover peer-hover:scale-105 transition duration-200 ease-in-out"
                      />
                    </Link>
                    <Link
                      href=""
                      className="w-full h-1/2 bg-gray-600 overflow-hidden"
                    >
                      <Image
                        src={postData[2].thumbnail[0]}
                        width={320}
                        height={320}
                        alt="게시물이미지"
                        className="w-full h-full object-cover"
                      />
                    </Link>
                  </div>
                  <Link
                    href=""
                    className="w-52 h-[450px] bg-gray-600 overflow-hidden"
                  >
                    <Image
                      src={postData[3].thumbnail[0]}
                      width={320}
                      height={320}
                      alt="게시물이미지"
                      className="w-full h-full object-cover peer-hover:scale-105 transition duration-150 ease-in-out"
                    />
                  </Link>
                  <Link
                    href=""
                    className="w-52 h-[450px] bg-gray-600 overflow-hidden"
                  >
                    {" "}
                    <Image
                      src={postData[4].thumbnail[0]}
                      width={320}
                      height={320}
                      alt="게시물이미지"
                      className="w-full h-full object-cover peer-hover:scale-105 transition duration-150 ease-in-out"
                    />
                  </Link>
                </div>
              }
            />
          </div>
        </section>
        <section className="flex pt-44 pb-32 flex-col  items-center w-full bg-[#F8F8F8]">
          <h4 className="text-gray-500 text-sm">
            주기적으로 연재되는 뉴스레터 시리즈를 만나보세요
          </h4>
          <h2 className="font-libre mt-2 text-2xl font-bold text-grayscale-700">
            Moonjin Sereis
          </h2>
        </section>
      </div>
    </main>
  );
}
