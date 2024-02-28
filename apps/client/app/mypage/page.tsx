"use client";
import { Tab } from "@headlessui/react";
import { ReaderHome } from "./_components/ReaderHome";
import ssr from "../../lib/fetcher/ssr";
import { redirect } from "next/navigation";
import useSWR from "swr";
import csr from "../../lib/fetcher/csr";
import { Fragment } from "react";

export default function Page() {
  const { data: userInfo } = useSWR<any>("user", (url: string) =>
    csr.get(url).then((res) => res.json()),
  );

  const userType = userInfo?.data?.user?.role === 1 ? "작가" : "독자";
  console.log(userInfo);
  const tabList =
    userType === "작가" ? ["작성글", "구독한 시리즈"] : ["구독한 시리즈"];

  return (
    <main className="flex flex-col   w-full">
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
            <ReaderHome />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </main>
  );
}
