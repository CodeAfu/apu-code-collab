import React, { Fragment } from "react";
import { NavRoute } from "./types";
import Nav from "./nav";
import Image from "next/image";
import Link from "next/link";
import MobileNav from "./mobile-nav";
import Authentication from "../_auth/authentication";

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
    label: "My Projects",
    href: "/projects",
  },
];

export default function Navbar() {
  return (
    <Fragment>
      <nav className="sm:h-16 h-12 bg-sidebar flex px-4 justify-between items-center gap-4">
        <div className="flex items-center justify-between gap-4 w-full h-full">
          <div className="flex items-center gap-4 h-full">
            <div className="dark:bg-white/75 flex items-center sm:size-10 size-8">
              <Link href="/">
                <Image
                  src="/assets/apu-logo.svg"
                  alt="logo"
                  width={52}
                  height={52}
                />
              </Link>
            </div>
            <Nav routes={routes} />
          </div>
          <Authentication />
        </div>

        <div className="flex items-center gap-4 h-full">
          <MobileNav routes={routes} />
        </div>
      </nav>
    </Fragment>
  );
}
