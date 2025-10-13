"use client";

import Modal from "@/components/modal";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(true);
  };

  return (
    <>
      <main>
        <div>Hi</div>
        <Button onClick={handleClick}>Modal</Button>
      </main>
      <Modal size="screen" isOpen={isOpen} onClose={() => setIsOpen(false)}>
        Content
      </Modal>
    </>
  );
}
