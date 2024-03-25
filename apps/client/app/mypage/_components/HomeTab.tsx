"use client";

import { Tab } from "@headlessui/react";
import { Fragment } from "react";
import { ReaderHome } from "./ReaderHome";
import {
  ReleasedPostWithWriterDto,
  ReleasedSeriesWithWriterDto,
} from "@moonjin/api-types";

export default function HomeTab({
  userType,
  seriesList,
  newsletterList,
}: {
  userType: any;
  seriesList: ReleasedSeriesWithWriterDto[];
  newsletterList: ReleasedPostWithWriterDto[];
}) {
  const tabList =
    userType === "작가" ? ["작성글", "구독한 뉴스레터"] : ["구독한 뉴스레터"];
  return (
    <>
      <Tab.Group defaultIndex={0}>
        <Tab.List className="flex gap-x-3">
          {tabList?.map((value, index) => (
            <Tab as={Fragment} key={index}>
              {({ selected }) => (
                /* Use the `selected` state to conditionally style the selected tab. */
                <button
                  className={`${
                    selected ? "border-b font-semibold" : null
                  } border-primary outline-none`}
                >
                  {value}
                </button>
              )}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels>
          {userType === "작가" && <Tab.Panel>Content 1</Tab.Panel>}
          <Tab.Panel>
            <ReaderHome
              seriesList={seriesList}
              newsletterList={newsletterList}
            />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </>
  );
}
