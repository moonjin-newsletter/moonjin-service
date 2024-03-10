import HomeTab from "./_components/HomeTab";
import ssr from "../../lib/fetcher/ssr";
import type {
  PostWithWriterUserDto,
  ResponseForm,
  SeriesWithWriterDto,
} from "@moonjin/api-types";
import { redirect } from "next/navigation";

export default async function Page() {
  const userInfo = await ssr("user")
    .then((res) => res.json<any>())
    .catch((err) => redirect("/auth/login"));
  const seriesList = await ssr("series/following").then((res) =>
    res.json<ResponseForm<SeriesWithWriterDto[]>>(),
  );
  const newsletterList = await ssr("post/newsletter").then((res) =>
    res.json<ResponseForm<PostWithWriterUserDto[]>>(),
  );

  console.log(userInfo);
  console.log(seriesList);
  console.log(newsletterList);

  const userType = userInfo?.data?.user?.role === 1 ? "작가" : "독자";

  return (
    <main className="flex flex-col   w-full">
      <HomeTab
        userType={userType}
        seriesList={seriesList.data}
        newsletterList={newsletterList.data}
      />
    </main>
  );
}
