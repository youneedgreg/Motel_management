"use client"


import React from 'react';
import { useRouter } from 'next/navigation';
import { FiLogOut } from 'react-icons/fi';
import RoomAvailability from '../../components/Roomavailability';

const WelcomePage: React.FC = () => {
  const router = useRouter();

  const handleLogout = () => {
    // Perform logout actions, such as clearing session or token
    // Example: localStorage.removeItem('token');

    // Redirect to the login page
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-800 text-white flex flex-col p-4">
      <div className="flex justify-end">
        <button onClick={handleLogout} className="text-white p-2 hover:text-red-500">
          <FiLogOut size={24} title="Logout" />
        </button>
      </div>
      <div className="mt-4">
        <RoomAvailability />
      </div>
      <div className="flex flex-col items-center justify-center flex-grow">
        <div className="max-w-md w-full text-center">
          <h1 className="text-3xl font-bold mb-4">Welcome!</h1>
          <p>You have successfully logged in.</p>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;