"use client";

import { useState } from "react";

export default function Test() {
  const [state, setState] = useState(0);
  const array = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];

  function prevEvent() {
    const carousel = document.getElementById("carousel");
    if (carousel) {
      carousel.style.transform = `translateX(${state + 192}px)`;
    }
    setState((prevState) => prevState + 192);
  }

  function NextEvent() {
    const carousel = document.getElementById("carousel");

    if (state > 5) {
    }
    if (carousel) {
      carousel.style.transform = `translateX(${state - 192}px)`;
    }

    setState((prevState) => prevState - 192);
  }

  return (
    <div className="flex flex-col w-96 overflow-hidden">
      <div
        id="carousel"
        className="flex w-fit transition ease-in-out duration-500"
      >
        {array.map((value, index) => (
          <div
            key={index}
            id={`${index}`}
            className="w-48 h-72 rounded-lg bg-gray-400 order-3"
          >
            {value.id}
          </div>
        ))}
      </div>

      <div className="flex gap-x-2.5">
        <button onClick={prevEvent}>이전</button>
        <button onClick={NextEvent}>다음</button>
      </div>
    </div>
  );
}
