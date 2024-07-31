"use client";

import { JSX, ReactElement, useEffect, useRef, useState } from "react";

type UseCarouselProps = {
  items: any[];
  width: number;
};

type CarouselProps = {
  children: ReactElement;
};

type UseCarouselReturn = {
  Carousel: ({ children }: CarouselProps) => JSX.Element;
  prevEvent: () => void;
  nextEvent: () => void;
};

export default function useCarousel({
  items,
  width,
}: UseCarouselProps): UseCarouselReturn {
  const carouselRef = useRef<HTMLUListElement>(null);
  const [currCell, setCurrCell] = useState(0);

  const prevEvent = () => {
    setCurrCell((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const nextEvent = () => {
    setCurrCell((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.style.transition = "2s ease-in-out";
      carouselRef.current.style.transform = `translateX(-${
        currCell * width
      }px) `;
    }
  }, [currCell]);

  const Carousel = ({ children }: CarouselProps) => {
    return (
      <div className="flex  w-full overflow-hidden h-full items-center transition ease-in-out duration-100">
        <ul ref={carouselRef} id="carousel" className="flex w-fit  h-fit px-5">
          {children}
        </ul>
      </div>
    );
  };

  return { Carousel, prevEvent, nextEvent };
}
