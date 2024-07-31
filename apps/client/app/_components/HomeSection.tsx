"use client";

import { LogoIcon } from "@components/icons";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import useCarousel from "@components/carousel/useCarousel";
import { postData } from "../_data";
import Image from "next/image";

export default function HomeSection() {
  const { Carousel, prevEvent, nextEvent } = useCarousel({
    items: postData,
    width: 192,
  });

  return (
    <section className="flex justify-end w-full h-screen bg-white max-w-[1006px] pt-16">
      <div className=" h-fit my-auto max-w-[318px] mr-20">
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
      <div className="flex flex-grow h-full w-full relative">
        <div
          className={`left-0 top-0 absolute h-full w-[60vw] bg-grayscale-100 rounded-l-xl transition ease-in-out duration-100`}
        >
          <Carousel>
            <>
              {" "}
              <h2 className="">
                이<br />
                주<br />의<br /> 인<br />
                기<br />글<br />
              </h2>
              {postData.map((value, index) => (
                <li
                  key={index}
                  id={`${index}`}
                  className="w-48 h-72 rounded-lg bg-gray-400 order-3"
                >
                  <Image
                    src={value.thumbnail[0]}
                    alt={""}
                    width={192}
                    height={288}
                  />
                </li>
              ))}
            </>
          </Carousel>
        </div>
      </div>
    </section>
  );
}
