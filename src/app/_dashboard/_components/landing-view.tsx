import Link from "next/link";
import ParticlesBackground from "./particles-background";
import { motion } from "motion/react";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

export default function LandingView() {
  return (
    <div className="relative overflow-hidden w-full">
      <ParticlesBackground />
      <div className="container mx-auto flex flex-col items-center justify-center min-h-[80vh] py-12 gap-8 text-center">
        <div className="space-y-4 max-w-2xl sm:p-16 p-8 rounded bg-muted/50 shadow">
          <div className="space-y-4 mb-8 max-w-2xl">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl">
              APU <span className="text-primary">Code Collab</span>
            </h1>
            <p className="text-xl text-foreground-subtle max-w-lg mx-auto">
              Connect your GitHub, find study partners, and showcase your best academic projects.
            </p>
          </div>
          <Link href="/user/login">
            <motion.button
              whileHover={{ scale: 1.03, }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="group relative mt-4 h-14 sm:h-16 px-8 sm:px-12 bg-primary text-primary-foreground text-lg font-bold rounded-xl shadow-lg flex items-center justify-center gap-3 mx-auto overflow-hidden hover:cursor-pointer"
            >
              <GitHubLogoIcon className="h-6 w-6 transition-transform group-hover:scale-105 duration-200 " />
              <span>Get Started with APU ID</span>
            </motion.button>
          </Link>
        </div>
      </div>
    </div>
  );
}
