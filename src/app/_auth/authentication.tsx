"use client";

import React from "react";
import Dropdown from "@/components/dropdown/dropdown";
import MenuLink from "./menu-link";
import { CircleUserRound } from "lucide-react";
import Avatar from "@/components/avatar";

export default function Authentication() {
  return (
    <div className="sm:flex hidden">
      <Dropdown triggerNode={<Avatar src="/assets/user.svg" alt="avatar" />}>
        <div className="flex flex-col rounded bg-card w-80">
          <MenuLink icon={<CircleUserRound />} href="/profile">
            Profile
          </MenuLink>
        </div>
      </Dropdown>
    </div>
  );
}
