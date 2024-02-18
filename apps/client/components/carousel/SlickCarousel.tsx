"use client";

import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function SlickCarousel() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
  };
  return (
    <div id="slider-container">
      <Slider {...settings}>
        <div className="px-1">
          <img src="https://via.placeholder.com/800x400" alt="image1" />
        </div>
      </Slider>
    </div>
  );
}
