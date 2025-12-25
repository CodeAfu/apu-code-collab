import { Input } from "@/components/input";
import { Search } from "lucide-react";

export default function SearchRepository() {
  return (
    <div className="relative ">
      <Input className="md:text-xl w-full pr-10 bg-card" />
      <button
        className="group absolute size-8 flex items-center justify-center rounded 
                  right-2 top-1/2 -translate-y-1/2 hover:bg-primary/10 active:bg-primary/10
                  transition duration-200"
      >
        <Search className="size-5 stroke-gray-500 group-active:scale-90 transition duration-200" />
      </button>
    </div>
  );
}
