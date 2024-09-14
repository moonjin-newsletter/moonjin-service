"use client";

import { LogoIcon } from "@components/icons";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import useCarousel from "@components/carousel/useCarousel";
import { homeData } from "../_data";
import Image from "next/image";
import Link from "next/link";

export default function HomeSection() {
  const { Carousel, prevEvent, nextEvent } = useCarousel({
    length: homeData.length - 1,
    width: 600,
  });

  return (
    <section className="flex  w-full h-fit bg-white max-w-[1006px] pt-16 mx-auto">
      <div className="flex flex-col h-full my-auto w-[232px] min-w-[232px]  mr-20 justify-center">
        <LogoIcon />
        <h1 className="mt-6 text-3xl font-bold text-grayscale-600 font-serif leading-relaxed">
          Moonjin
          <br />
          Newsletter
        </h1>
        <p className="text-grayscale-600 mt-10 break-keep">
          이곳은 삶의 고민과 사색 그리고 경험을 아카이브 하는 공간입니다.
          문진에서 다양한 뉴스레터를 만나보세요.
        </p>
        <button className="py-2.5 w-fit px-6 bg-grayscale-700 text-white rounded-lg mt-8">
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
      <div className="flex h-fit w-full relative ">
        <div className="h-fit px-5 py-14 bg-grayscale-100 rounded-l-xl animate-fade">
          <Carousel>
            <>
              <h2 className="font-serif text-2xl pl-5 pr-14 leading-9">
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
                  <div className="pl-[120px] flex">
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
    <Link
      href={"/@andy91052990/post/2"}
      className="flex max-w-[440px] w-[440px] overflow-hidden  gap-x-6"
    >
      <Image
        src={postInfo?.thumbnail[0]}
        alt={"썸네일 이미지"}
        width={200}
        height={258}
        className="w-[200px] h-[258px] min-w-[200px] rounded object-cover"
      />
      <div className="flex w-full flex-col  h-full">
        <div className="w-fit py-1.5 px-2 text-xs font-medium bg-grayscale-700 text-white rounded-full flex items-center justify-center">
          {postInfo.category[0]}
        </div>
        <h2 className="font-serif text-lg font-semibold mt-3 ">
          {postInfo.title}
        </h2>
        <span className=" mt-4 text-sm text-grayscale-600">
          {postInfo.subtitle}
        </span>
        <span className="font-libre mt-10 text-sm text-grayscale-500">
          Written by.{postInfo.writer}
        </span>
      </div>
    </Link>
  );
}
