import { ReactNode } from "react";

export interface ProfileItemLink {
  type: "link";
  icon: ReactNode;
  href: string;
  label: ReactNode;
}

export interface ProfileItemButton {
  type: "button";
  icon: ReactNode;
  onClick: () => void;
  label: ReactNode;
}

export interface ProfileItemSeparator {
  type: "separator";
}

export type ProfileItemType =
  | ProfileItemLink
  | ProfileItemButton
  | ProfileItemSeparator;

export interface AuthError {
  detail: {
    message: string;
    error_code: string;
    debug?: string;
  };
}
