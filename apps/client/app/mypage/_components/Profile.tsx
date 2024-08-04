import Image from "next/image";
import { userType } from "@utils/checkUser";
import { UserOrWriterDto } from "@moonjin/api-types";

export default function Profile({
  userInfo,
  role,
}: {
  userInfo: UserOrWriterDto;
  role: userType;
}) {
  return (
    <section className="flex items-end relative w-full max-w-[1006px] pt-7  gap-x-6">
      <div className="py-11 px-20">
        <Image
          alt="작가 프로필 이미지"
          className=" absolute left-0 rounded-lg -top-12 bg-gray-600 w-40 h-40 object-fill"
          height={160}
          src={userInfo.user.image}
          width={160}
        />
      </div>

      <div className="flex h-fit  w-full  flex-col  ">
        <div className="flex font-medium text-3xl items-center gap-x-2.5 ">
          {userInfo.user.nickname}
          <div className="py-1 text-sm px-3 border border-grayscale-400 rounded-full text-gray-500">
            {role}
          </div>
        </div>

        {userInfo?.user?.description != "" && (
          <span className="mt-3 text-grayscale-500 line-clamp-2 text-sm">
            {userInfo.user.description}
          </span>
        )}
      </div>
      {role === "작가" && (
        <div className="ml-auto flex ">
          {[
            { title: "뉴스레터", body: userInfo?.writerInfo?.newsletterCount },
            {
              title: "시리즈",
              body: userInfo?.writerInfo?.seriesCount,
            },
            {
              title: "구독자",
              body: userInfo?.writerInfo?.followerCount,
            },
          ].map((value, index) => (
            <div
              className={`flex font-medium text-grayscale-500 flex-col items-center border-grayscale-400 px-7 ${
                index !== 2 ? "border-r" : ""
              }`}
              key={index}
            >
              <div className="w-fit whitespace-nowrap">{value.title}</div>
              <span className="text-xl font-semibold text-grayscale-700">
                {value.body}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
