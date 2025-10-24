import React from "react";
import Image from "next/image";

interface AvatarProps {
  src: string;
  alt: string;
}

export default function Avatar({ src, alt }: AvatarProps) {
  return (
    <div
      className="size-10 border border-primary bg-muted rounded-full overflow-hidden flex items-center justify-center 
                  hover:cursor-pointer hover:scale-105 active:scale-105 active:ring-1 transition duration-200"
    >
      <Image src={src} alt={alt} width={52} height={52} className="scale-118" />
    </div>
  );
}
