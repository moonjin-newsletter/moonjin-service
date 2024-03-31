import { isNonEmptyArray, isNotNil } from "@toss/utils";
import { UnreleasedNewsletterCard } from "../newsletter/prepare/_components/UnreleasedCard";
import EmptyCard from "../../_components/EmptyCard";
import ssr from "../../../../lib/fetcher/ssr";
import { AllFollowerDto, ResponseForm } from "@moonjin/api-types";

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
      <section className="flex w-full mt-4">
        {isNonEmptyArray(newList ?? []) ? (
          (groupList?.followerList?.map((follower, index) => (
            <FollowerCard follower={follower} />
          )),
          groupList?.externalFollowerList?.map((follower, index) => (
            <ExternalCard follower={follower} />
          )))
        ) : (
          <EmptyCard text={"작성 중인 글이 없습니다"} />
        )}
      </section>
    </main>
  );
}

function FollowerCard({ follower }: { follower: any }) {
  return <div className="w-full"></div>;
}

function ExternalCard({ follower }: { follower: any }) {
  return <div className="w-full"></div>;
}
