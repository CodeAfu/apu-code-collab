import ConnectGithub from "./_landing/connect-github";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center sm:mt-0 mt-24 sm:min-h-[calc(100dvh-4rem)] py-4 px-4">
      <ConnectGithub />
    </main>
  );
}
