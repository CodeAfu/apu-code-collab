"use client";

import React, { Fragment } from "react";
import { createPortal } from "react-dom";
import Backdrop from "../backdrop";
import Modal from "../modal";
import useMounted from "@/hooks/use-mounted";
import LoginForm from "./login-form";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const mounted = useMounted();
  if (!mounted) return null;
  return createPortal(
    <Fragment>
      {isOpen && <Backdrop onClose={onClose} />}
      <Modal className="p-8" size="lg" isOpen={isOpen} onClose={onClose}>
        <LoginForm closeModal={onClose} />
      </Modal>
    </Fragment>,
    document.body
  );
}
