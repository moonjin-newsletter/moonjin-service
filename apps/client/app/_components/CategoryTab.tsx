"use client";

import { Tab } from "@headlessui/react";
import { ReactElement } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function CategoryTab({
  tabList,
  layout,
}: {
  tabList: string[];
  layout: ReactElement;
}) {
  const router = useRouter();
  const selectedTab = useSearchParams().get("tab") ?? tabList[0];

  function handleChangeTabs(index: number) {
    const afterTab = tabList[index];
    afterTab && router.push(`?tab=${afterTab}`);
  }

  return (
    <>
      <Tab.Group
        selectedIndex={tabList.findIndex((value) => value === selectedTab)}
        onChange={handleChangeTabs}
      >
        <Tab.List className="w-full flex flex-wrap justify-center max-w-[480px] mx-auto gap-x-2 gap-y-3">
          {tabList.map((value, index) => (
            <Tab
              className=" text-sm py-1.5 px-4 rounded-full border border-grayscale-300 aria-selected:border-primary aria-selected:text-primary text-gray-400 outline-none"
              key={index}
            >
              {value}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels>
          {tabList.map((value, index) => (
            <Tab.Panel key={index}>{layout}</Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </>
  );
}
