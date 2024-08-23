"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import 전체뉴스레터 from "./전체뉴스레터";
import 자유뉴스레터 from "./자유뉴스레터";
import 시리즈뉴스레터 from "./시리즈뉴스레터";

const statusForTabs: Record<string, number> = {
  전체: 0,
  자유: 1,
  시리즈: 2,
};

export default function WriterTab({ moonjinId }: { moonjinId: string }) {
  const router = useRouter();
  const selectedTab = useSearchParams().get("tab") ?? "전체";

  function handleChangeTabs(index: number) {
    const afterTab = index === 1 ? "자유" : index === 2 ? "시리즈" : "전체";
    afterTab && router.push(`?tab=${afterTab}`);
  }

  return (
    <section className="w-full mt-20 ">
      <TabGroup
        selectedIndex={statusForTabs[selectedTab]}
        onChange={handleChangeTabs}
      >
        <TabList className="w-full flex items-center sticky top-0 bg-white">
          <Tab className="flex-1 py-3   data-[selected]:border-grayscale-600/85 data-[selected]:text-grayscale-700 font-medium border-b-2 border-grayscale-200 text-grayscale-500 focus:ring-0 ring-0 outline-none">
            전체 뉴스레터
          </Tab>
          <Tab className="flex-1 py-3  data-[selected]:border-grayscale-600/85 data-[selected]:text-grayscale-700 font-medium border-b-2 border-grayscale-200 text-grayscale-500 focus:ring-0 ring-0 outline-none">
            자유 뉴스레터
          </Tab>
          <Tab className="flex-1 py-3  data-[selected]:border-grayscale-600/85 data-[selected]:text-grayscale-700 font-medium border-b-2 border-grayscale-200 text-grayscale-500 focus:ring-0 ring-0 outline-none">
            시리즈 뉴스레터
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <section className="flex flex-col  ">
              <전체뉴스레터 moonjinId={moonjinId} />
            </section>
          </TabPanel>
          <TabPanel>
            <section className="flex flex-col">
              <자유뉴스레터 moonjinId={moonjinId} />
            </section>
          </TabPanel>
          <TabPanel>
            <section className="flex flex-col">
              <시리즈뉴스레터 moonjinId={moonjinId} />
            </section>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </section>
  );
}
