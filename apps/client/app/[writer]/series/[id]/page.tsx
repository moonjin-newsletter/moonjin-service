type pageProps = {
  params: {
    writer: string;
    id: string;
  };
};

export default async function Page({ params }: pageProps) {
  return (
    <div>
      <h1>Page</h1>
    </div>
  );
}
