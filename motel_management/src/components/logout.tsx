import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";

const LogoutButton: React.FC = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Remove the token
    router.push('/'); // Redirect to login page
  };

  return (
    <Button
      onClick={handleLogout}
      className="border border-white text-white hover:bg-white hover:text-gray-800 transition-colors duration-200"
    >
      Logout
    </Button>
  );
};

export default LogoutButton;
