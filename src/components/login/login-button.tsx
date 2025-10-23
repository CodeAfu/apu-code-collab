// "use client";

// import React, { Fragment, useState } from "react";
// import { Button } from "@/components/ui/button";
// import LoginModal from "./login-modal";
// import { isLoggedIn } from "@/lib/auth";

// export default function LoginButton() {
//   const [isOpen, setIsOpen] = useState(false);
//   const loggedIn = isLoggedIn();

//   const handleOpen = () => {
//     setIsOpen(true);
//   };

//   const handleClose = () => {
//     setIsOpen(false);
//   };

//   if (loggedIn) return null;

//   return (
//     <Fragment>
//       <Button onClick={handleOpen}>Sign in</Button>
//       <LoginModal isOpen={isOpen} onClose={handleClose} />
//     </Fragment>
//   );
// }
