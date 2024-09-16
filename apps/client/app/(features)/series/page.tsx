import Header from "@components/layout/Header";
import Footer from "@components/layout/Footer";
import Graphic from "./graphic-series.png";
import Image from "next/image";

export default function Page() {
  return (
    <>
      <Header />
      <main className="w-full min-h-screen pt-28 flex justify-center">
        <section className="w-full flex flex-col items-center max-w-[1006px]">
          <Image src={Graphic} alt="Series" width={200} height={200} />
          <h1 className="text-2xl font-bold mt-4 font-serif text-primary">
            Series Newsletter
          </h1>
          <p className="text-grayscale-500 text-center text-sm mt-2 font-serif">
            문진의 작가분들이 연재하는 시리즈 간행물을 만나보세요.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
