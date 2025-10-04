"use client";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "motion/react";
import React, { useState } from "react";

export default function Basics() {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <div className="grid h-screen gap-4 place-content-center">
      <motion.button
        className="bg-primary px-4 py-2 rounded-lg shadow-md"
        onClick={() => {
          setIsVisible(!isVisible);
        }}
        layout
      >
        Show/Hide
      </motion.button>
      <AnimatePresence mode="popLayout">
        {isVisible && (
          <motion.div
            className="size-64 bg-purple-800"
            initial={{
              rotate: "0deg",
              scale: 0,
            }}
            animate={{
              rotate: "180deg",
              scale: 1,
              y: [0, 150, -150, -150, 0],
            }}
            exit={{
              rotate: "0deg",
              scale: 0,
            }}
            transition={{
              duration: 5,
              ease: "backInOut",
              times: [0, 0.25, 0.5, 0.85, 1],
            }}
          >
            TEXT
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
