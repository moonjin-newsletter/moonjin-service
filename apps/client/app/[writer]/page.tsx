import { notFound } from "next/navigation";

type pageProps = {
  params: {
    writer: string;
  };
};

export default function Page({ params }: pageProps) {
  const [, name] = decodeURI(params.writer).split("%40");
  if (!name) notFound();
  console.log(name);
  return <main className="mt-20">{name} hi</main>;
}
