import * as I from "components/icons";

export default function EmptyCard({ text }: { text?: string }) {
  return (
    <div className="w-full flex flex-col gap-y-4 items-center justify-center py-12">
      <I.Empty />
      <span className="text-grayscale-500 ">
        {text ?? "아직 작성된 글이 없습니다"}
      </span>
    </div>
  );
}
