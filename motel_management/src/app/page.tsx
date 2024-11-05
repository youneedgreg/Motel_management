"use client";

import { useState } from "react";
import AuthPage from "./auth-page";
import WelcomePage from "./welcome/page";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Function to handle setting login state
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    <div>
      {isLoggedIn ? (
        <WelcomePage />
      ) : (
        <AuthPage onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}
