import Link from "next/link";
import Image from "next/image";

type VerticalCardProps = {
  title: string;
  description: string;
  thumbnail: string;
  href: string;
};

export default function VerticalCard({
  title,
  description,
  thumbnail,
  href,
}: VerticalCardProps) {
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
          비상계엄하의 군사재판은 군인·군무원의 범죄나 군사에 관한 간첩죄의
          경우와 초병·초소·유독음식물공급·포로에 비상계엄하의 군사재판은
          군인·군무원의 범죄나 군사에 관한 간첩죄의 경우와
          초병·초소·유독음식물공급·포로에
        </div>
      </div>

      <div className="flex items-center gap-x-2">
        <Image
          src=""
          alt="작가이미지"
          className="w-7 h-7 rounded-full object-cover bg-gray-400"
        />
        <p className="text-sm text-grayscale-500">
          <span className="font-serif font-medium">by.</span>
          작가이름
        </p>
        <span className="text-sm font-light text-grayscale-500 ml-auto">
          2023.01.02
        </span>
      </div>
    </Link>
  );
}
