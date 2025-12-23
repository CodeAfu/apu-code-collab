import ConnectGithub from "./_components/connect-github";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center sm:my-0 mt-24 my-60 sm:min-h-[calc(100dvh-4rem)] py-4 px-4">
      <ConnectGithub />
    </main>
  );
}
