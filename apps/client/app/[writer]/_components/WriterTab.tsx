"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { range } from "@toss/utils";

const statusForTabs: Record<string, number> = {
  전체: 0,
  자유: 1,
  시리즈: 2,
};

export default function WriterTab() {
  const router = useRouter();
  const selectedTab = useSearchParams().get("tab") ?? "전체";

  function handleChangeTabs(index: number) {
    const afterTab = index === 1 ? "자유" : index === 2 ? "시리즈" : "전체";
    afterTab && router.push(`?tab=${afterTab}`);
  }

  return (
    <section className="w-full mt-28">
      <TabGroup
        selectedIndex={statusForTabs[selectedTab]}
        onChange={handleChangeTabs}
      >
        <TabList className="w-full flex items-center sticky top-0 bg-white">
          <Tab className="flex-1 py-3.5 text-sm  data-[selected]:border-grayscale-600/85 data-[selected]:text-grayscale-700 font-medium border-b-2 border-grayscale-200 text-grayscale-500 focus:ring-0 ring-0 outline-none">
            전체 뉴스레터
          </Tab>
          <Tab className="flex-1 py-3.5 text-sm data-[selected]:border-grayscale-600/85 data-[selected]:text-grayscale-700 font-medium border-b-2 border-grayscale-200 text-grayscale-500 focus:ring-0 ring-0 outline-none">
            자유 뉴스레터
          </Tab>
          <Tab className="flex-1 py-3.5 text-sm data-[selected]:border-grayscale-600/85 data-[selected]:text-grayscale-700 font-medium border-b-2 border-grayscale-200 text-grayscale-500 focus:ring-0 ring-0 outline-none">
            시리즈 뉴스레터
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <div className="flex flex-col gap-y-2">
              {range(0, 12).map((item, i) => (
                <div key={i} className="w-full bg-grayscale-400 h-28"></div>
              ))}
            </div>
          </TabPanel>
          <TabPanel>Content 2</TabPanel>
          <TabPanel>Content 3</TabPanel>
        </TabPanels>
      </TabGroup>
    </section>
  );
}
