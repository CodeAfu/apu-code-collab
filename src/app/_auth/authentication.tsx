"use client";

import React from "react";
import Dropdown from "@/components/dropdown/dropdown";
import MenuLink from "./menu-link";
import { BookMarked, CircleUserRound, LogOut } from "lucide-react";
import Avatar from "@/components/avatar";

export default function Authentication() {
  return (
    <div className="md:flex hidden">
      <Dropdown triggerNode={<Avatar src="/assets/user.svg" alt="avatar" />}>
        <div className="flex flex-col rounded bg-card w-80">
          <MenuLink icon={<CircleUserRound />} href="/profile">
            Profile
          </MenuLink>
          <MenuLink icon={<BookMarked />} href="/profile">
            Repositories
          </MenuLink>
          <MenuLink icon={<LogOut />} href="/profile">
            Sign Out
          </MenuLink>
        </div>
      </Dropdown>
    </div>
  );
}
