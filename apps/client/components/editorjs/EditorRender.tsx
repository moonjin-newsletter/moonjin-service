import { ReactNode } from "react";
import type { EditorBlockDto } from "@moonjin/editorjs";

type ListItem = {
  content: string;
  items: Array<ListItem>;
};

export type BlockType = {
  type: string;
  data: {
    text?: string;
    level?: number;
    caption?: string;
    url?: string;
    file?: {
      url?: string;
    };
    stretched?: boolean;
    withBackground?: boolean;
    withBorder?: boolean;
    items?: Array<string> | Array<ListItem>;
    style?: string;
    code?: string;
    service?: "vimeo" | "youtube";
    source?: string;
    embed?: string;
    width?: number;
    height?: number;
    alignment?: "left" | "right" | "center" | "justify";
    align?: "left" | "right" | "center" | "justify";
  };
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
      className="text-grayscale-600 font-light leading-normal"
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
            dangerouslySetInnerHTML={{ __html: block.data.text }}
          />
        );
      case "header":
        const Tag = `h${block.data.level}` as keyof JSX.IntrinsicElements;
        return (
          <Tag
            key={index}
            dangerouslySetInnerHTML={{ __html: block.data.text }}
          />
        );

      case "delimiter":
        return <hr className="my-5" />;
      case "image":
        return (
          <figure key={index} className="my-4">
            <img src={block.data.file.url} alt={block.data.caption} />
            <figcaption className="text-center">
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

function ListRender(items: any, style: "ordered" | "unordered" | undefined) {
  return (
    <ul
      className={`${style === "ordered" ? "list-decimal" : "list-disc"} pl-4`}
    >
      {items.map((item: any, index: any) => (
        <>
          <li key={index}>{item.content}</li>
          {item.items && item.items.length > 0 && ListRender(item.items, style)}
        </>
      ))}
    </ul>
  );
}
