import Image from "next/image";
import { More } from "@components/icons";

export default function WriterProfile() {
  return (
    <header className="w-full h-60  flex items-center gap-x-4">
      <Image
        src={""}
        alt=""
        width={240}
        height={240}
        className="w-60 min-w-60 h-60 object-cover bg-grayscale-200 rounded-lg  overflow-hidden shadow"
      />
      <div className="flex grow flex-col w-full h-full">
        <h1 className="text-lg font-semibold">테스트작가</h1>
        <strong className="text-primary font-medium">test@moonjin.site</strong>
        <span className="line-clamp-3 flex grow items-center mt-4 text-grayscale-500 text-sm">
          안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요
        </span>
        <div className="flex items-center mt-4 justify-between w-full">
          <div className="flex gap-x-4">
            {[
              { head: "시리즈", body: 57 },
              { head: "구독자", body: 1300 },
            ].map((item, index) => (
              <div className="flex items-center gap-x-1.5">
                <span className="text-grayscale-500 font-light">
                  {item.head}
                </span>
                <span>{item.body}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-x-2.5">
            <button className="py-1.5 px-3 rounded-full text-sm bg-grayscale-600 text-white">
              구독하기
            </button>
            <More />
          </div>
        </div>
      </div>
    </header>
  );
}
