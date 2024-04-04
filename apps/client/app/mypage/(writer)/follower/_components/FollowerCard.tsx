"use client";
import { ExternalFollowerDto, FollowerDto } from "@moonjin/api-types";
import Image from "next/image";
import { format } from "date-fns";
import csr from "../../../../../lib/fetcher/csr";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

async function deleteFollower(userId?: number, externalEmail?: string) {
  if (userId) {
    return await csr.delete(`user/follower/${userId}`).then((res) => {
      toast.success("구독목록에서 삭제됐습니다");
    });
  } else {
    return await csr
      .delete(`user/follower/external`, {
        json: { followerEmail: externalEmail },
      })
      .then((res) => {
        toast.success("구독목록에서 삭제됐습니다");
      });
  }
}

export function FollowerCard({ follower }: { follower: FollowerDto }) {
  const router = useRouter();
  return (
    <div className="w-full rounded-lg p-4 bg-grayscale-100 flex items-center">
      <Image
        src={follower.user.image}
        alt="작가 프로필 이미지"
        width={48}
        height={48}
        className="w-12 h-12 rounded-full bg-grayscale-400 object-contain"
      />
      <div className="flex flex-col ml-3">
        <h3 className="font-semibold">{follower.user.nickname}</h3>
        <span>{follower.user.description}</span>
      </div>
      <div className="ml-auto flex items-center gap-x-2.5">
        <p className="text-grayscale-500 ml-auto text-sm gap-x-2.5">
          {format(new Date(follower.following.createdAt), "yyyy-MM-dd")}부터
          구독
        </p>
        <button
          onClick={async () => {
            await deleteFollower(follower.user.id);
            router.refresh();
          }}
          className="text-sm py-1.5 px-2.5 bg-grayscale-300 hover:brightness-75 text-grayscale-500  rounded-lg"
        >
          삭제
        </button>
      </div>
    </div>
  );
}

export function ExternalCard({ follower }: { follower: ExternalFollowerDto }) {
  const router = useRouter();
  return (
    <div className="w-full rounded-lg p-4 bg-grayscale-100 flex items-center">
      <div className="flex flex-col ml-3">
        <h3 className="font-semibold">{follower.email}</h3>
      </div>
      <div className="ml-auto flex items-center gap-x-2.5">
        <p className="text-grayscale-500 ml-auto text-sm gap-x-2.5">
          {format(new Date(follower.createdAt), "yyyy-MM-dd")}부터 구독
        </p>
        <button
          onClick={async () => {
            await deleteFollower(undefined, follower.email);
            router.refresh();
          }}
          className="text-sm py-1.5 px-2.5 bg-grayscale-300 hover:brightness-75 text-grayscale-500  rounded-lg"
        >
          삭제
        </button>
      </div>
    </div>
  );
}
