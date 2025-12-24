import { Fragment } from "react";
import { NavRoute } from "./types";
import Nav from "./nav";
import Image from "next/image";
import Link from "next/link";
import MobileNav from "./mobile-nav";
import MobileGridLeftToggle from "@/components/grid-page/mobile-grid-left-toggle";
import AuthComponents from "./auth-components";

const routes: NavRoute[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Browse",
    href: "/browse",
  },
  {
    label: "Guides",
    href: "/guides",
  },
  {
    label: "Color Showcase",
    href: "/color-showcase",
    devOnly: true,
  },
];

export default function Navbar() {
  const visibleRoutes = routes.filter(
    (route) => !route.devOnly || process.env.NODE_ENV === "development"
  );
  return (
    <Fragment>
      <nav className="sm:h-16 h-12 bg-card flex px-2 justify-between items-center gap-4 border-b border-border">
        <div className="flex items-center justify-between gap-4 w-full h-full">
          <div className="flex items-center gap-2 h-full">
            <MobileGridLeftToggle />
            <div className="dark:bg-white/75 flex items-center sm:size-10 size-8 mr-4 hover:scale-105 transition-transform duration-200">
              <Link href="/">
                <Image
                  src="/assets/apu-logo.svg"
                  alt="logo"
                  width={52}
                  height={52}
                />
              </Link>
            </div>
            <Nav routes={visibleRoutes} />
          </div>
          <div className="md:flex hidden items-center gap-2">
            <AuthComponents />
          </div>
        </div>

        <div className="flex items-center gap-4 h-full">
          <MobileNav routes={visibleRoutes} />
        </div>
      </nav>
    </Fragment>
  );
}
