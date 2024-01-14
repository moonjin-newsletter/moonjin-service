import { assert } from "@toss/assert";
import ky, { HTTPError } from "ky";
import type { KyResponse, BeforeRetryHook, BeforeErrorHook } from "ky";

/**
 * TODO: csr 분석 및 수정 필요
 */
let refreshingPromise: Promise<KyResponse> | null = null;
const refresh: BeforeRetryHook = async ({ error, retryCount }) => {
  if (
    error instanceof HTTPError &&
    error.response.status === 401 &&
    retryCount < 2
  ) {
    // 대기중인 refresh promise가 있는지 확인하고, 없다면 만든다.
    if (!refreshingPromise) {
      refreshingPromise = csr.get("auth/refresh", { retry: 0 }).then((res) => {
        refreshingPromise = null;
        return res;
      });
    }
    // 진행중인 refresh promise가 끝날 때까지 기다린다.
    await refreshingPromise;
    // 쿠키에 저장된 새로운 access token을 사용한다.
  }
};

const getErrorMessage: BeforeErrorHook = async (error) => {
  const body = await error.response?.json();
  error.message = body?.data.message ?? error.message;
  return body;
};

assert(process.env.NEXT_PUBLIC_SERVER_URL, "NEXT_PUBLIC_SERVER_URL is not set");
const csr = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_SERVER_URL,
  credentials: "include",
  retry: {
    statusCodes: [401, 403, 408, 413, 429, 500, 502, 503, 504],
  },
  hooks: {
    beforeRetry: [refresh],
    beforeError: [getErrorMessage],
  },
});

export default csr;
