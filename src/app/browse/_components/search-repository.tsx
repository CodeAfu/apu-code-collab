"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

interface SearchRepositoryProps {
  mobileTrigger?: React.ReactNode;
}

export default function SearchRepository({ mobileTrigger }: SearchRepositoryProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("search") || "");

  useEffect(() => {
    setValue(searchParams.get("search") || "");
  }, [searchParams]);

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (value.trim()) {
      params.set("search", value.trim());
    } else {
      params.delete("search");
    }
    router.push(`?${params.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="flex gap-2 w-full animate-in fade-in duration-500">
      {mobileTrigger}

      <div className="relative flex-1">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search repositories..."
          className="md:text-lg w-full pr-10 bg-card focus:outline-none focus:ring-foreground/50 h-10 md:h-12"
        />
        <button
          onClick={handleSearch}
          className="group absolute size-8 flex items-center justify-center rounded 
                  right-2 top-1/2 -translate-y-1/2 hover:bg-primary/10 active:bg-primary/10
                  transition duration-200"
        >
          <Search className="size-5 stroke-gray-500 group-active:scale-90 transition duration-200" />
        </button>
      </div>
    </div>
  );
}
