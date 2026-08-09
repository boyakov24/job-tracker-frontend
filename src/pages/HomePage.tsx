import DemoBoard from "../components/home/DemoBoard";

function HomePage() {
  return (
    <main className="min-h-[calc(100vh-64px)] bg-[#f8fafc]">
      <section className="mx-auto flex max-w-6xl flex-col items-center px-6 py-24 text-center">
        <h1 className="max-w-3xl text-5xl font-bold tracking-tight text-[#0f172a] sm:text-6xl leading-tight">
          Track every <span className="text-[#34d399]">job application</span> in
          one place
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-[#475569] sm:text-xl font-medium">
          Stay organized, keep track of your applications, and never miss an
          important follow-up.
        </p>

        <div className="flex items-center mt-4 gap-2 text-sm font-semibold text-[#475569] px-4 py-2 bg-white border border-[#e2e8f0] rounded-full shadow-sm">
          <span className="flex h-2 w-2 rounded-full bg-[#34d399]" />
          100% Free Live Tracking
        </div>
      </section>
      <section className="mx-auto w-full max-w-6xl px-6 pb-24">
        <DemoBoard />
      </section>
    </main>
  );
}

export default HomePage;
