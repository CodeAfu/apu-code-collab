"use client";

import React from "react";
import Dropdown from "@/components/dropdown/dropdown";
import Avatar from "@/components/avatar";
import AccountItem from "./profile-item";
import { useProfileMenu } from "@/hooks/use-profile-menu";
import { generateRandomNodeKey } from "@/lib/utils";

export default function Profile() {
  const menus = useProfileMenu();
  return (
    <div className="md:flex hidden">
      <Dropdown triggerNode={<Avatar src="/assets/user.svg" alt="avatar" />}>
        <div className="flex flex-col rounded bg-card w-80">
          {menus.map((item, index) => (
            <AccountItem
              key={generateRandomNodeKey(item.type + index.toString())}
              item={item}
            />
          ))}
        </div>
      </Dropdown>
    </div>
  );
}
