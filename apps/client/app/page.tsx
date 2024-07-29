import Image from "next/image";
import Background from "../public/images/background.png";
import CategoryTab from "./_components/CategoryTab";
import { postData, seriesData, writerData } from "./_data";
import Link from "next/link";
import * as I from "components/icons";
import SeriesCarousel from "./_components/SeriesCarousel";
import Header from "@components/layout/Header";
import HomeSection from "./_components/HomeSection";

export default async function Page() {
  return (
    <main className=" w-full min-h-screen  ">
      <Header />
      <div className="relative flex flex-col items-center justify-center w-full h-full min-h-screen overflow-hidden">
        <HomeSection />
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
          <div className="w-full h-fit overflow-x-hidden ">
            <SeriesCarousel series={seriesData} />
          </div>
        </section>
        <section className="flex pt-44  flex-col  items-center w-full ">
          <h4 className="text-gray-500 text-sm">
            문진의 인기있는 작가를 만나보세요
          </h4>
          <h2 className="font-libre mt-2 text-2xl font-bold text-grayscale-700">
            Moonjin Writers
          </h2>
          <div className="w-full max-w-[1006px] mt-8 flex flex-col items-center text-sm">
            <CategoryTab
              tabList={["시・수필", "소설", "에세이", "평론", "기타"]}
              layout={
                <div className="flex mt-12 gap-x-[26px] gap-y-10 flex-wrap w-full">
                  {writerData.map((writer, idx) => (
                    <div key={idx}>
                      <WriterCard data={writer} />
                    </div>
                  ))}
                </div>
              }
            />
          </div>
        </section>

        <section className="flex pt-44  flex-col  items-center w-full ">
          <h4 className="text-gray-500 text-sm">
            문진만만의 다양한 인기글들을 만나보세요.
          </h4>
          <h2 className="font-libre mt-2 text-2xl font-bold text-grayscale-700">
            Moonjin Libraries
          </h2>
          <div className="w-full max-w-[1006px] mt-8 flex flex-col items-center text-sm">
            <CategoryTab
              tabList={["시・수필", "소설", "에세이", "평론", "기타"]}
              layout={
                <div className="flex mt-12 gap-x-[26px] gap-y-10 flex-wrap w-full">
                  {postData.map((post, idx) => (
                    <div key={idx}>
                      <PostCard post={post} />
                    </div>
                  ))}
                </div>
              }
            />
          </div>
        </section>

        <section className="flex pt-44  flex-col  items-center w-full pb-40">
          <div className="flex flex-col items-center text-center">
            <I.LogoIcon />
            <span className="text-xl mt-6 font-bold text-grayscale-700">
              읽고 싶은 글을 찾지 못하셨나요?
              <br />글 게시판에서 더 많은 글을 찾아보세요
            </span>
            <span className="mt-4 text-base font-medium text-grayscale-500">
              뉴스레터 플랫폼을 통해 더 많은 독자들과 소통하며 수익을
              창출해보세요.
              <br />
              쉽게 뉴스레터를 만들고, 독자들을 위한 흥미로운 콘텐츠
            </span>
            <Link
              href=""
              className="py-2.5 px-6 bg-grayscale-600 text-white rounded-lg mt-10"
            >
              전체 게시글 보러가기
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

function WriterCard({ data }: { data: any }) {
  return (
    <Link href="" className="w-[232px] flex flex-col items-center px-2 gap-y-4">
      <div className="relative ">
        <Image
          src={data.thumbnail}
          width={112}
          height={112}
          alt="작가이미지"
          className="bg-grayscale-200 rounded-full w-28 h-28  border-2 border-primary object-cover"
        />
      </div>
      <div className="flex items-center gap-x-1">
        {["시", "소설", "이야기"].map((category, idx) => (
          <div
            key={idx}
            className={`py-1.5 px-3 rounded-full 
            ${
              idx === 0
                ? "bg-primary text-white"
                : "border border-grayscale-700 text-grayscale-800"
            }
            
            `}
          >
            {category}
          </div>
        ))}
      </div>
      <div className="text-sm font-medium text-grayscale-500">
        비상계엄하의 군사재판은 군인·군무원의 범죄나 군사에 관한 간첩죄의 경우와
        초병·초소·유독음식물공급·포로에
      </div>

      <button className="py-2 px-6 font-medium text-sm rounded-lg bg-grayscale-600 text-white">
        구독+
      </button>
    </Link>
  );
}

function PostCard({ post }: { post: any }) {
  return (
    <Link href="" className="w-[232px] flex flex-col  px-2 gap-y-4">
      <div className="relative ">
        <Image
          src={post.thumbnail}
          width={232}
          height={232}
          alt="작가이미지"
          className="bg-grayscale-200  w-[232px] h-[232px]    object-cover"
        />
      </div>

      <div className="flex flex-col gap-y-1.5">
        <span className="text-left font-bold text-lg">{post.title}</span>

        <div className=" font-medium text-grayscale-500">
          비상계엄하의 군사재판은 군인·군무원의 범죄나 군사에 관한 간첩죄의
          경우와 초병·초소·유독음식물공급·포로에
        </div>
      </div>

      <div className="flex items-center gap-x-2">
        <Image
          src=""
          alt="작가이미지"
          className="w-7 h-7 rounded-full object-cover bg-gray-400"
        />
        <span className="text-sm font-medium text-grayscale-500">
          By.작가이름
        </span>
        <span className="text-sm font-light text-grayscale-500 ml-auto">
          2023.01.02
        </span>
      </div>
    </Link>
  );
}
