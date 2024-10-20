import Header from "@components/layout/Header";
import Footer from "@components/layout/Footer";
import Image from "next/image";
import Graphic from "@public/static/images/graphic-all.png";
import CategoryTab from "../../_components/CategoryTab";
import { Category } from "@moonjin/api-types";

export const revalidate = 600;

export default function Page() {
  return (
    <>
      <Header />
      <main className="w-full min-h-screen pt-28 pb-32 flex justify-center">
        <section className="w-full flex flex-col items-center max-w-[1006px]">
          <Image src={Graphic} alt="Series" width={200} height={200} />
          <h1 className="text-2xl font-bold mt-4 font-serif text-primary">
            Moonjin Newsletter
          </h1>
          <p className="text-grayscale-500 text-center text-sm mt-2 font-serif">
            문진 작가분들의 고민과 이야기를 읽어보세요.
          </p>
          <div className="w-full mt-24 flex flex-col items-center text-sm">
            <CategoryTab
              requestUrl={"newsletter/list"}
              tabList={Category.list}
              infiniteScroll={true}
            />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
