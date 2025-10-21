import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100dvh-4rem)] flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-9xl font-bold">404</h1>
        <Link
          href="/"
          className="text-lg text-primary-foreground bg-primary px-4 py-2 rounded
                     hover:bg-accent transition duration-200"
        >
          Return to homepage
        </Link>
      </div>
    </div>
  );
}
