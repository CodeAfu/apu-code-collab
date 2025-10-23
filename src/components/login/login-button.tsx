"use client";

import React, { Fragment, useState } from "react";
import { Button } from "@/components/ui/button";
import LoginModal from "./login-modal";

export default function LoginButton() {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Fragment>
      <Button onClick={handleOpen}>Sign in</Button>
      <LoginModal isOpen={isOpen} onClose={handleClose} />
    </Fragment>
  );
}
