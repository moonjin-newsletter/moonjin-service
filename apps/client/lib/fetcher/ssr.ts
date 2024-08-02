import ky from "ky";
import {cookies} from "next/headers";

/**
 * TODO: ssr 분석 및 수정 필요
 */

const ssr = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_SERVER_URL,
  credentials: "include",
  timeout: 10000,
  next: { revalidate: 0 },
  hooks: {
    beforeRequest: [
      async (request) => {
        const cookiesArray = cookies().getAll();
        request.headers.set(
          "Cookie",
          cookiesArray.reduce(
            (acc, item) => acc + `${item.name}=${item.value}; `,
            "",
          ),
        );
        request.headers.set(
          "Authorization",
          `Bearer ${cookiesArray.find((item) => item.name === "accessToken")
            ?.value}`,
        );
        return request;
      },
    ],
  },
});

export default ssr;
