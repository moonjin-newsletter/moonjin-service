"use client";
import { Tab } from "@headlessui/react";
import { Fragment } from "react";
import { isNonEmptyArray } from "@toss/utils";
import NewsLetterCard from "../../../_components/NewsLetterCard";

export default function SettingTab() {
  return (
    <Tab.Group>
      <Tab.List className="w-full flex gap-x-4">
        {["프로필 설정", "비밀번호 변경"].map((category, index) => (
          <Tab key={index} as={Fragment}>
            {({ selected }) => (
              /* Use the `selected` state to conditionally style the selected tab. */
              <button
                className={`${
                  selected ? "border-b-2 font-semibold" : null
                } border-primary py-1 outline-none`}
              >
                {category}
              </button>
            )}
          </Tab>
        ))}
      </Tab.List>
      <Tab.Panels className="w-full mt-4">
        <Tab.Panel></Tab.Panel>
        <Tab.Panel>
          <section className="flex flex-col w-full"></section>
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  );
}

function ProfileLayout() {
  return <div></div>;
}
