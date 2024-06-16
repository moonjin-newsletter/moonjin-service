import { isNonEmptyArray, isNotNil } from "@toss/utils";
import EmptyCard from "../../_components/EmptyCard";
import ssr from "../../../../lib/fetcher/ssr";
import { AllSubscriberDto, ResponseForm } from "@moonjin/api-types";

import { ExternalCard, FollowerCard } from "./_components/FollowerCard";
import AddFollower from "./_components/AddFollower";

export default async function Page() {
  const { data: groupList } = await ssr("subscribe/subscriber/all").then(
    (res) => res.json<ResponseForm<AllSubscriberDto>>(),
  );

  const newList = [
    ...groupList.subscriberList,
    ...groupList.externalSubscriberList,
  ];

  return (
    <main className="overflow-hidden w-full max-w-[748px]">
      <div className="flex ">
        <div className="border-b pb-1 h-fit font-semibold border-primary">
          구독자 목록
        </div>
        <div className="py-0.5 h-fit font-semibold px-2 ml-2 text-sm rounded bg-primary  text-white">
          {isNotNil(newList) ? newList.length : 0}
        </div>
        {/*<section className="ml-auto flex items-center gap-x-2.5">*/}
        {/*  <AddFollower />*/}
        {/*</section>*/}
      </div>
      <section className="flex flex-col w-full mt-4">
        {isNonEmptyArray(newList ?? []) ? (
          <div className="flex flex-col gap-y-4">
            <div className="flex flex-col w-full gap-y-4">
              {groupList?.subscriberList?.map((follower, index) => (
                <FollowerCard follower={follower} />
              ))}
            </div>
            <div className="flex  flex-col w-full gap-y-4">
              {groupList?.externalSubscriberList?.map((follower, index) => (
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
