"use client";

import Dropdown from "@/components/dropdown/dropdown";
import Avatar from "@/components/avatar";
import ProfileItem from "./profile-item";
import { useProfileMenu } from "@/hooks/use-profile-menu";
import { generateRandomNodeKey, logApiError } from "@/lib/utils";
import { LogOut } from "lucide-react";
import { useClearAuthToken } from "@/stores/auth-store";
import api from "@/lib/api";

export default function Profile() {
  const menus = useProfileMenu();
  const cleartAuthToken = useClearAuthToken();

  const handleLogout = async () => {
    try {
      await api.post("/api/v1/auth/logout");
      cleartAuthToken();
    } catch (error) {
      logApiError(error);
    }
  }

  return (
    <div className="flex items-center justify-center">
      <Dropdown triggerNode={<Avatar src="/assets/user.svg" alt="avatar" />}>
        <div className="flex flex-col rounded bg-card w-80">
          {menus.map((item, index) => (
            <ProfileItem
              key={generateRandomNodeKey(`profile-item-${index}`)}
              item={item}
            />
          ))}
          <ProfileItem
            item={{
              type: "button",
              icon: <LogOut />,
              onClick: () => handleLogout(),
              label: "Sign out",
            }}
          />
        </div>
      </Dropdown>
    </div>
  );
}
