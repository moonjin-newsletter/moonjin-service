import { isNonEmptyArray } from "@toss/utils";
import { SWRInfiniteResponse } from "swr/infinite";
import { ReactElement, ReactNode, Ref, useEffect, useState } from "react";

export const getKey =
  (path: string) =>
  <PageData extends Array<unknown>>(
    pageNo: number,
    prevPageData?: PageData,
  ) => {
    if (prevPageData && !isNonEmptyArray(prevPageData)) return null; // 끝에 도달
    const separator = /\?/.test(path) ? "&" : "?";
    return `${path}${separator}pageNo=${pageNo}`;
  };

type Props<T> = {
  swr: SWRInfiniteResponse<T>;
  isReachingEnd: (swr: SWRInfiniteResponse<T>) => boolean;
  children: ReactElement | string | number | ((data: T) => ReactNode);
  ender?: ReactNode;
  loader?: ReactNode;
  intersectionOffset?: number;
  fallback?: ReactNode;
};

const useIntersection = <TElement extends HTMLElement>(): [
  boolean,
  Ref<TElement>,
] => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [element, setElement] = useState<TElement | null>(null);
  useEffect(() => {
    if (!element) return;
    const observer = new IntersectionObserver((entries) => {
      setIsIntersecting(entries[0]?.isIntersecting);
    });
    observer.observe(element);
    return () => observer.unobserve(element);
  }, [element]);
  return [isIntersecting, (el) => el && setElement(el)];
};

export default function SWRInfiniteScroll<T>({
  swr,
  swr: { setSize, isValidating, data, error },
  isReachingEnd,
  ender,
  loader,
  children,
  intersectionOffset = 0,
  fallback,
}: Props<T>): ReactElement<Props<T>> {
  const [intersecting, ref] = useIntersection<HTMLDivElement>();
  const isEnd = isReachingEnd(swr);

  useEffect(() => {
    if (intersecting && !isValidating && !isEnd) setSize((x) => x + 1).then();
  }, [intersecting, isEnd, isValidating, setSize]);

  return (
    <>
      {typeof children === "function" ? data?.map(children) : children}
      <div className="relative">
        <div
          ref={ref}
          className="absolute"
          style={{ top: -intersectionOffset }}
        />
        {isEnd ? ender : error ? fallback : loader}
      </div>
    </>
  );
}
