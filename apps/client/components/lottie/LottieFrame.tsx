"use client";

import { ReactNode } from "react";
import Lottie from "lottie-react";

interface LottieFrameProps {
  className?: string;
  gap: number; // Lottie의 맨 위 부분과 children 사이의 간격 (px)
  lottie: any;
  children?: ReactNode;
}

export default function LottieFrame({
  className = "",
  gap,
  lottie,
  children,
}: LottieFrameProps) {
  return (
    <div className={`relative ${className}`}>
      <Lottie {...lottie} />
      <div
        className="absolute inset-x-0 w-full text-center text-base font-bold text-gray-900"
        style={{ top: `${gap}px` }}
      >
        {children}
      </div>
    </div>
  );
}
