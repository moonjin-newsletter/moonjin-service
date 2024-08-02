"use client";

import { LogoIcon } from "@components/icons";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import useCarousel from "@components/carousel/useCarousel";
import { homeData } from "../_data";
import Image from "next/image";
import Link from "next/link";

export default function HomeSection() {
  const { Carousel, prevEvent, nextEvent } = useCarousel({
    items: homeData,
    width: 192,
  });

  return (
    <section className="flex justify-end w-full h-fit bg-white max-w-[1006px] pt-16">
      <div className="flex flex-col h-full my-auto max-w-[318px] mr-20 justify-center py-auto">
        <LogoIcon />
        <h1 className="mt-6 text-3xl font-bold text-grayscale-600 font-serif leading-relaxed">
          Moonjin
          <br />
          Newsletter
        </h1>
        <p className="text-grayscale-600 mt-10">
          이곳은 삶의 고민과 사색 그리고 경험을 아카이브 하는 공간입니다.
          뉴스레터 문진에서 다양한 글을 만나보세요.
        </p>
        <button className="py-2.5 px-6 bg-grayscale-700 text-white rounded-lg mt-8">
          뉴스레터 구독하기
        </button>

        <div className="mt-20 flex items-center gap-x-1">
          <button
            onClick={prevEvent}
            className="h-10 w-10 border  border-grayscale-300 p-auto flex items-center justify-center"
          >
            <IoIosArrowBack className="text-2xl" />
          </button>

          <button
            onClick={nextEvent}
            className="h-10 w-10 border border-grayscale-300 p-auto flex items-center justify-center "
          >
            <IoIosArrowForward className="text-2xl" />
          </button>
        </div>
      </div>
      <div className="flex flex-grow h-[680px] w-full relative ">
        <div
          className={`left-0 top-0 absolute h-full px-5 w-[60vw] bg-grayscale-100 rounded-l-xl transition ease-in-out duration-100`}
        >
          <Carousel>
            <>
              {" "}
              <h2 className="font-serif text-2xl px-3">
                이<br />
                주<br />의<br /> 인<br />
                기<br />글<br />
              </h2>
              {homeData.map((value, index) => (
                <li
                  key={index}
                  id={`${index}`}
                  className="flex flex-col gap-y-10 gap-x-5"
                >
                  <CarouselCard postInfo={value[0]} />
                  <div className="pl-[120px]">
                    <CarouselCard postInfo={value[1]} />
                  </div>
                </li>
              ))}
            </>
          </Carousel>
        </div>
      </div>
    </section>
  );
}

function CarouselCard({ postInfo }: { postInfo: any }) {
  return (
    <Link href={""} className="flex items-center gap-x-6">
      <Image
        src={postInfo?.thumbnail[0]}
        alt={""}
        width={200}
        height={258}
        className="w-[200px] h-[258px] min-w-[200px] rounded object-cover"
      />
      <div className="flex flex-col whitespace-nowrap">
        <div className="py-1 px-1.5 bg-grayscale-700 text-white rounded-full flex items-center justify-center">
          {postInfo.category[0]}
        </div>
        <h2 className="font-serif font-medium">{postInfo.title}</h2>
        <span className="mt-4 text-sm">{postInfo.subtitle}</span>
        <span className="mt-auto text-sm text-grayscale-500">
          by.{postInfo.writer}
        </span>
      </div>
    </Link>
  );
}
