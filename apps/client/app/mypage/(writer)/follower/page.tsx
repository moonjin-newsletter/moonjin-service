import { isNonEmptyArray, isNotNil } from "@toss/utils";
import { UnreleasedNewsletterCard } from "../newsletter/prepare/_components/UnreleasedCard";
import EmptyCard from "../../_components/EmptyCard";
import ssr from "../../../../lib/fetcher/ssr";
import {
  AllFollowerDto,
  ExternalFollowerDto,
  FollowerDto,
  ResponseForm,
} from "@moonjin/api-types";
import Image from "next/image";
import { format } from "date-fns";
import { ExternalCard, FollowerCard } from "./_components/FollowerCard";

export default async function Page() {
  const { data: groupList } = await ssr("user/follower").then((res) =>
    res.json<ResponseForm<AllFollowerDto>>(),
  );

  const newList = [
    ...groupList.followerList,
    ...groupList.externalFollowerList,
  ];

  return (
    <main className="overflow-hidden w-full max-w-[748px]">
      <div className="flex ">
        <div className="border-b font-semibold border-primary">구독자 목록</div>
        <div className="py-1 font-semibold px-2 ml-2 text-sm rounded bg-gray-200 text-gray-400">
          {isNotNil(newList) ? newList.length : 0}
        </div>
      </div>
      <section className="flex flex-col w-full mt-4">
        {isNonEmptyArray(newList ?? []) ? (
          <div className="flex flex-col gap-y-4">
            <div className="flex flex-col w-full gap-y-4">
              {groupList?.followerList?.map((follower, index) => (
                <FollowerCard follower={follower} />
              ))}
            </div>
            <div className="flex  flex-col w-full gap-y-4">
              {groupList?.externalFollowerList?.map((follower, index) => (
                <ExternalCard follower={follower} />
              ))}
            </div>
          </div>
        ) : (
          <EmptyCard text={"구독중인 독자가 없습니다"} />
        )}
      </section>
    </main>
  );
}
