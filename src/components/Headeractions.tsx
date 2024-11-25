// components/HeaderActions.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FiLogOut } from "react-icons/fi";

const HeaderActions: React.FC = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    router.push("/");
  };

  const goToReports = () => {
    router.push("/reports");
  };

  return (
    <div className="flex justify-end space-x-4 mb-4">
      <button
        onClick={goToReports}
        className="text-white p-2 hover:text-blue-500"
      >
        Reports
      </button>
      <button onClick={handleLogout} className="text-white p-2 hover:text-red-500">
        <FiLogOut size={24} title="Logout" />
      </button>
    </div>
  );
};

export default HeaderActions;
