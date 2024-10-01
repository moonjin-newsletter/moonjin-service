import Link from "next/link";
import Image from "next/image";
import { WriterProfileInCardDto } from "@moonjin/api-types";
import { format } from "date-fns";

type VerticalCardProps = {
  title: string;
  subtitle: string;
  createdAt: Date;
  thumbnail: string;
  href: string;
  writer: WriterProfileInCardDto;
};

export default function VerticalCard({
  title,
  subtitle,
  thumbnail,
  createdAt,
  href,
  writer,
}: VerticalCardProps) {
  console.log(writer);
  return (
    <Link href={href} className="w-[232px] flex flex-col  gap-y-4">
      <div className="relative ">
        <Image
          src={thumbnail}
          width={232}
          height={232}
          alt="작가이미지"
          className="bg-grayscale-200  w-[232px] h-[232px]  rounded-lg  object-cover"
        />
      </div>

      <div className="flex flex-col gap-y-2">
        <strong className="text-left font-bold text-lg">{title}</strong>

        <div className="text-[13px] line-clamp-3 text-grayscale-500 ">
          {subtitle}
        </div>
      </div>

      <div className="flex items-center gap-x-2">
        <Image
          src={writer.profileImage}
          width={28}
          height={28}
          alt="작가이미지"
          className="w-7 h-7 rounded-full object-cover bg-gray-400"
        />
        <p className="text-sm text-grayscale-500">
          <span className="font-serif font-medium">by.</span>
          {writer.nickname}
        </p>
        <span className="text-sm font-light text-grayscale-500 ml-auto">
          {format(new Date(createdAt), "yyyy.MM.dd")}
        </span>
      </div>
    </Link>
  );
}
