"use client";

import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function SeriesCarousel({
  series,
}: {
  series: Array<any | object>;
}) {
  const settings = {
    dots: false,
    infinite: true,
    speed: 300,
    slidesToShow: 7,
    autoplay: true,
    autoplaySpeed: 3000,
    cssEase: "linear",
    slidesToScroll: 1,
  };
  return (
    <div id="slider-container">
      <Slider {...settings} className="transition ease-in-out duration-100">
        {series.map((value, index) => (
          <div key={index} className="px-5 mb-2 mt-4  h-fit">
            <PostCard value={value} />
          </div>
        ))}
      </Slider>
    </div>
  );
}

function PostCard({ value }: { value: any }) {
  return (
    <div className=" flex flex-col w-48 relative">
      <div className="relative w-full h-fit  group">
        <img src={value.thumbnail} alt="image1" className="w-full h-64 peer" />
        <div className="absolute items-center backdrop-blur bottom-0 w-full hidden flex-col bg-black/70 text-white group-hover:flex px-4 py-8">
          <span className="text-sm">Contents</span>
          <table className="mt-3">
            <tbody>
              {[
                {
                  id: 1,
                  body: "우리의 여름은 언제부터 시작했을까?.... 세상은 어렵고 복잡하다. 하지만 행복해",
                },
                {
                  id: 1,
                  body: "우리의 여름은 언제부터 시작했을까?.... 세상은 어렵고 복잡하다. 하지만 행복해",
                },
                {
                  id: 1,
                  body: "우리의 여름은 언제부터 시작했을까?.... 세상은 어렵고 복잡하다. 하지만 행복해",
                },
              ].map((value, index) => (
                <tr key={index} className="space-y-2  align-top">
                  <th className=" h-fit text-left py-2  font-normal align-top text-xs w-12">
                    Part {index + 1}.
                  </th>
                  <td className="line-clamp-2 align-top text-xs text-ellipsis">
                    {value.body}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-4 flex flex-col ">
        <span className="text-lg font-bold">{value.title}</span>
        <div className="flex mt-2 w-full justify-between items-center text-sm text-grayscale-500">
          <span>{value.date}</span>
          <span>By.{value.writer}</span>
        </div>
      </div>
    </div>
  );
}
