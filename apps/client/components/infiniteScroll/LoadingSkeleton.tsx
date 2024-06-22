import Skeleton from "react-loading-skeleton";

export const LoadingSkeleton = (
  <article className="flex flex-col px-4 pb-5 pt-6">
    <header className="flex justify-between">
      <Skeleton width={80} height={15} />
      <div className="flex items-center gap-x-2 text-sm text-gray-400">
        <Skeleton width={50} height={15} />
      </div>
    </header>
    <section className="mt-2.5 flex  gap-2.5">
      <div className="flex grow flex-col gap-2.5">
        <Skeleton width={200} height={15} />
        <Skeleton width={300} height={40} />
      </div>
    </section>
    <footer className="mt-5 flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <Skeleton width={70} height={15} />
      </div>
      <Skeleton width={30} height={15} />
    </footer>
  </article>
);
