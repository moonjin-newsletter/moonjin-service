"use client";

import { toast } from "react-hot-toast";

function setUrl(url: string | null, userId: number | null) {
  if (userId) {
    return url
      ? url + `?referral_id=${userId}`
      : window.location.origin +
          window.location.pathname +
          `?referral_id=${userId}`;
  } else {
    return url ? url : window.location.origin + window.location.pathname;
  }
}

export default function WebShareButton({
  title,
  subtitle,
  url = null,
  children,
}: {
  title: string;
  subtitle: string;
  url: string | null;
  children: React.ReactNode;
}) {
  // const { data, isLoading, error } = useSWR<IUser>("user");

  const webShare = async () => {
    const copyUrl = setUrl(url, null);

    // if (navigator.share) {
    //   navigator
    //     .share({
    //       title: title + "\n" ?? "[moonjin]\n",
    //       text: subtitle + "\n" ?? "삶과 경험이 모이는 공간\n",
    //       url: copyUrl,
    //     })
    //     .then(() => console.log("Successful share"))
    //     .catch((error) => console.error("Error sharing", error));
    // } else {
    navigator.clipboard
      .writeText(copyUrl)
      .then(() => toast.success("URL 복사 성공"));
    // }
  };

  return (
    <button className="relative size-full cursor-pointer " onClick={webShare}>
      {children}
    </button>
  );
}
