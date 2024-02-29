import Link from "next/link";
import * as Io from "react-icons/io";
import Image from "next/image";

const dummyLetter = [
  {
    id: 1,
    title: "안녕하세요 , 이것은 테스트 데이터 입니다.",
    body: "송금 전 사기 내역 조회로 피해를 미리 방지할 수 있어요 송금 전 토스가 알아서 사기 내역 조회를 해드려요. 상대방의 연락처 또는 계좌가 사기 계좌인지 조회해 안전하게 송금할 수 있어요.송금 전 사기 내역 조회로 피해를 미리 방지할 수 있어요 송금 전 토스가 알아서 사기 내역 조회를 해드려요. 상대방의 연락처 또는 계좌가 사기 계좌인지 조회해 안전하게 송금할 수 있어요.",
    category: ["수필", "시"],
    image: "",
    date: "2023.11.09",
    writer: "김땡땡",
  },
];

export function ReaderHome() {
  return (
    <div className="flex flex-col w-full gap-y-12">
      <SeriesNewsletter />
      <NewsletterList />
    </div>
  );
}

function SeriesNewsletter() {
  return (
    <section className="flex flex-col w-full">
      <div className="flex justify-end">
        <Link
          href=""
          className="flex items-center text-grayscale-500 gap-x-2.5"
        >
          시리즈 전체보기 <Io.IoIosArrowForward />
        </Link>
      </div>
    </section>
  );
}

function NewsletterList() {
  return (
    <section className="flex flex-col w-full">
      <div className="flex justify-between">
        <div className="border-b font-semibold border-primary">
          구독한 뉴스레터
        </div>

        <Link
          href=""
          className="flex items-center text-grayscale-500 gap-x-2.5"
        >
          뉴스레터 전체보기 <Io.IoIosArrowForward />
        </Link>
      </div>
      <div className="flex flex-col w-full mt-4">
        {dummyLetter.map((value, index) => (
          <Link
            key={index}
            href=""
            className="flex px-2 py-4 border-b border-grayscale-200"
          >
            <Image
              src={value.image}
              alt="뉴스레터 썸네일"
              width={80}
              height={80}
              className="w-28 h-28 bg-gray-600 rounded-lg"
            />
            <div className="flex flex-col ml-4">
              <div>{value.title}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
