"use client";
import { Toaster } from "react-hot-toast";
import { SWRConfig } from "swr";
import { HTTPError } from "ky";
import { arrayIncludes } from "@toss/utils";
import csr from "../lib/fetcher/csr";
import { PropsWithChildren } from "react";

export default function ClientProvider({ children }: PropsWithChildren) {
  return (
    <>
      <Toaster position="bottom-right" />
      <SWRConfig
        value={{
          onErrorRetry: (
            error: HTTPError,
            key,
            config,
            revalidate,
            { retryCount }
          ) => {
            if (arrayIncludes([401, 404], error.response?.status)) return; // Never retry on specific HTTP status codes.
            if (arrayIncludes(["auth/isLogin", "user"], key)) return; // Never retry for a specific key.
            setTimeout(() => revalidate({ retryCount }), 5 * 1000); // Retry after 5 seconds.
          },
          fetcher: (url) => csr.get(url).json(),
        }}
      >
        {children}
      </SWRConfig>
    </>
  );
}
