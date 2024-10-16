import { ReactNode } from "react";
import type { EditorBlockDto } from "@moonjin/editorjs-types";
import "./EditorRender.css";

type ListItem = {
  content: string;
  items: Array<ListItem>;
};

export default function EditorRender({
  blocks,
  children,
}: {
  blocks: EditorBlockDto[];
  children?: ReactNode;
}) {
  const content = renderEditorData(blocks);

  return (
    <article
      id="editor-output"
      className="text-grayscale-600 font-light leading-7 tracking-wide relative z-0  max-w-full"
    >
      {content}
    </article>
  );
}

function renderEditorData(blocks: EditorBlockDto[]) {
  return blocks.map((block: any, index: any) => {
    switch (block.type) {
      case "paragraph":
        return (
          <p
            key={index}
            dangerouslySetInnerHTML={{ __html: block.data.text || "&nbsp;" }}
          />
        );
      case "header":
        const Tag = `h${block.data.level}` as keyof JSX.IntrinsicElements;
        return (
          <Tag
            key={index}
            className={`
                text-grayscale-800  font-semibold py-2
                ${
                  block.data.level === 1
                    ? "text-2xl"
                    : block.data.level === 2
                      ? "text-xl"
                      : block.data.level === 3
                        ? "text-lg"
                        : block.data.level === 4
                          ? "text-base"
                          : block.data.level === 5
                            ? "text-sm"
                            : "text-xs"
                }
            `}
            dangerouslySetInnerHTML={{ __html: block.data.text }}
          />
        );

      case "delimiter":
        return <hr className="my-5" />;
      case "image":
        return (
          <figure key={index} className={` my-4 flex flex-col`}>
            <div className={`w-full`}>
              <img
                className={`${
                  block.data.withBackground ? "w-2/3 mx-auto" : "w-full"
                } 
                ${block.data.withBorder ? "border border-grayscale-200" : ""}
                
                `}
                src={block.data.file.url}
                alt={block.data.caption}
              />
            </div>
            <figcaption className="text-center text-sm text-grayscale-400 mt-2">
              {block.data.caption}
            </figcaption>
          </figure>
        );
      case "list":
        return ListRender(block.data.items, block.data.style);

      default:
        return null;
    }
  });
}

function ListRender(
  items: any[],
  style: "ordered" | "unordered" | undefined,
  depth = 0,
) {
  if (style === "ordered") {
    return (
      <ol className={`${depth === 0 ? "list-decimal" : "list-roman"} pl-4`}>
        {items.map((item: any, index: any) => (
          <>
            <li key={index}>{item.content}</li>
            {item.items &&
              item.items.length > 0 &&
              ListRender(item.items, style, depth + 1)}
          </>
        ))}
      </ol>
    );
  }

  return (
    <ul className={`${depth === 0 ? "list-disc" : "list-square"} pl-4`}>
      {items.map((item: any, index: any) => (
        <>
          <li key={index}>{item.content}</li>
          {item.items &&
            item.items.length > 0 &&
            ListRender(item.items, style, depth + 1)}
        </>
      ))}
    </ul>
  );
}
