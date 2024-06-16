"use client";

import { Tab } from "@headlessui/react";
import { ReactDOM, ReactElement } from "react";

export default function CategoryTab({
  tabList,
  layout,
}: {
  tabList: string[];
  layout: ReactElement;
}) {
  return (
    <>
      <Tab.Group>
        <Tab.List className="w-full flex justify-center">
          {tabList.map((value, index) => (
            <Tab
              className="mx-2.5 py-1 font-semibold aria-selected:border-b-2 border-primary aria-selected:text-primary text-gray-600 outline-none"
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
