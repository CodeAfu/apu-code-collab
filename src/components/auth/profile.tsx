"use client";

import React from "react";
import Dropdown from "@/components/dropdown/dropdown";
import Avatar from "@/components/avatar";
import AccountItem from "./profile-item";
import { useProfileMenu } from "@/hooks/use-profile-menu";
import { generateRandomNodeKey } from "@/lib/utils";
import { LogOut } from "lucide-react";
import { useClearAuthToken } from "@/stores/auth-store";

export default function Profile() {
  const menus = useProfileMenu();
  const logOut = useClearAuthToken();
  return (
    <div className="flex items-center justify-center">
      <Dropdown triggerNode={<Avatar src="/assets/user.svg" alt="avatar" />}>
        <div className="flex flex-col rounded bg-card w-80">
          {menus.map((item, index) => (
            <AccountItem
              key={generateRandomNodeKey(`profile-item-${index}`)}
              item={item}
            />
          ))}
          <AccountItem
            item={{
              type: "button",
              icon: <LogOut />,
              onClick: () => logOut(),
              label: "Sign out",
            }}
          />
        </div>
      </Dropdown>
    </div>
  );
}
