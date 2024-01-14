import Image from "next/image";
import Background from "../public/images/background.png";

export default function Page(): JSX.Element {
  return (
    <main className=" w-full min-h-screen  ">
      <div className="relative flex items-center justify-center w-full h-full min-h-screen">
        <section className="flex-1 w-full h-full min-h-screen bg-gray-600">
          <Image
            className="absolute top-0 left-0 z-0 w-screen h-screen object-cover"
            src={Background}
            alt="백그라운드 이미지"
          />
        </section>
      </div>
    </main>
  );
}
