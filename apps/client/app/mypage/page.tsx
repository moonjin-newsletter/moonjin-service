export default function Page() {
  const userInfo = 0;

  return (
    <main className="flex flex-col items-center">
      <section className="h-52 w-full bg-gray-600"></section>
      <section className="max-w-[1006px]">
        {userInfo === 0 && <div>asdf</div>}
      </section>
    </main>
  );
}
