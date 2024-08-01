"use client";

import { JSX, ReactElement, useEffect, useState } from "react";

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

const Carousel = ({ children }: CarouselProps) => {
  return (
    <div className="flex w-full overflow-hidden h-full items-center">
      <ul id="carousel" className="flex w-fit h-fit px-5">
        {children}
      </ul>
    </div>
  );
};

export default function useCarousel({
  items,
  width,
}: UseCarouselProps): UseCarouselReturn {
  const [currCell, setCurrCell] = useState(0);

  const prevEvent = () => {
    setCurrCell((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const nextEvent = () => {
    setCurrCell((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const carouselRef = document?.getElementById("carousel");
    if (carouselRef) {
      carouselRef.style.transition = "all 0.5s ease-in-out";
      carouselRef.style.transform = `translateX(-${currCell * width}px) `;
    }
  }, [currCell]);

  return { Carousel, prevEvent, nextEvent };
}
