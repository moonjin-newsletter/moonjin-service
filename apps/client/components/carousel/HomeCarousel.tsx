"use client";

import { JSX, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type UseCarouselProps = {
  posts: any[];
};

type UseCarouselReturn = {
  Carousel: () => JSX.Element;
  prevEvent: () => void;
  nextEvent: () => void;
};

export default function useCarousel({
  posts,
}: UseCarouselProps): UseCarouselReturn {
  const carouselRef = useRef<HTMLUListElement>(null);
  const [currCell, setCurrCell] = useState(0);

  const prevEvent = () => {
    setCurrCell((prev) => (prev === 0 ? posts.length - 1 : prev - 1));
  };

  const nextEvent = () => {
    setCurrCell((prev) => (prev === posts.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.style.transition = "all 2s ease-in-out";
      carouselRef.current.style.transform = `translateX(-${currCell * 192}px) `;
    }
  }, [currCell]);

  const Carousel = () => {
    return (
      <div className="flex  w-full overflow-hidden h-full items-center">
        <ul ref={carouselRef} id="carousel" className="flex w-fit  h-fit px-5">
          <h2 className="">
            이<br />
            주<br />의<br /> 인<br />
            기<br />글<br />
          </h2>
          {posts.map((value, index) => (
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
        </ul>
      </div>
    );
  };

  return { Carousel, prevEvent, nextEvent };
}

function HomeItems({ post }: { post: any }) {
  return (
    <Link href={`/post/${post.id}`}>
      <div className="w-[192px] h-[288px] rounded-lg bg-gray-400 order-3">
        <Image src={post.thumbnail[0]} alt={""} width={192} height={288} />
      </div>
    </Link>
  );
}
