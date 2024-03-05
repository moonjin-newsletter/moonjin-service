import Link from "next/link";
import Image from "next/image";

export default function NewsLetterCard({ value }: { value: any }) {
  return (
    <Link href="" className="flex w-full  py-4 border-b border-grayscale-200">
      <Image
        src={value.image}
        alt="뉴스레터 썸네일"
        width={80}
        height={80}
        className="w-28 min-w-[112px] h-28 bg-gray-600 rounded-lg"
      />
      <div className="flex w-full flex-col ml-4">
        <div className="flex gap-x-1.5 ">
          {value.category.map((category: any, index: number) => (
            <div className="border border-grayscale-400 text-grayscale-400 py-0.5 px-2 rounded text-xs">
              # {category}
            </div>
          ))}
        </div>
        <div className="flex w-full">
          <div className="max-w-[340px]">
            <div className="mt-2 font-medium">{value.title}</div>
            <span className="line-clamp-2 text-sm text-grayscale-500">
              {value.body}
            </span>
          </div>
          <div className="ml-auto text-sm text-grayscale-500">
            <div>{value.date}</div>
            <span>{value.writer}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
