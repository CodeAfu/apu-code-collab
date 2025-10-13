"use client";

export default function ScreenSizeIndicator() {
  if (process.env.NODE_ENV !== "development") return null;

  return (
    <div className="fixed right-5 bottom-5 z-50 bg-accent/80 text-accent-foreground px-3 py-2 rounded-md font-mono text-sm backdrop-blur-sm">
      <div className="block sm:hidden">xs</div>
      <div className="hidden sm:block md:hidden">sm</div>
      <div className="hidden md:block lg:hidden">md</div>
      <div className="hidden lg:block xl:hidden">lg</div>
      <div className="hidden xl:block 2xl:hidden">xl</div>
      <div className="hidden 2xl:block">2xl</div>
    </div>
  );
}
