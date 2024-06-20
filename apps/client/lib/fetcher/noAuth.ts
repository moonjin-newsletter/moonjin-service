import { assert } from "@toss/assert";
import { notFound } from "next/navigation";

/**
 * @deprecated
 */

export default async function noAuth<T>(
  path: `/${string}`,
  { revalidate }: { revalidate: boolean } = { revalidate: true },
): Promise<T> {
  assert(
    process.env.NEXT_PUBLIC_SERVER_URL,
    "NEXT_PUBLIC_SERVER_URL is not set",
  );

  // 헤더에 다른 값을 넣으면 next.revalidate설정이 안 먹는 것 같다
  // 그래서 캐싱 문제가 발생해서 결제 페이지등에서 결제금액 불일치 오류가 날 수 있다
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}${path}`, {
    next: { revalidate: revalidate ? 600 : 0 },
  });

  const result = await res.json();

  if (!res.ok || result?.statusCode) {
    if (revalidate && [401, 403, 404].includes(result.statusCode)) notFound();
    throw new Error(
      result?.message ?? `Error ${res?.status}: ${res?.statusText}`,
    );
  }

  return result as T;
}

export const nfetch = async <T>(path: string, init?: RequestInit) => {
  const url = new URL(path, process.env.NEXT_PUBLIC_SERVER_URL);
  const res = await fetch(url, init);

  if (!res.ok) {
    if (res.status === 401 || res.status === 403 || res.status === 404)
      notFound();
    throw new Error(`Error ${res.status}: ${res.statusText}`);
  }

  return (await res.json()) as T;
};
