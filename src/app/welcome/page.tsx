"use client"

import React from 'react';
import { useRouter } from 'next/navigation';
import { FiLogOut } from 'react-icons/fi';
import RoomAvailability from '../../components/RoomAvailability';
import AddGuest from '@/components/AddGuest';
import BookedGuestList from '@/components/BookedGuest';
import CheckedInGuestList from '@/components/CheckedIn';
import CheckedOutGuestList from '@/components/CheckedOut';
import withAuth from '@/hooks/withauth';


const WelcomePage: React.FC = () => {
  const router = useRouter();

  const handleLogout = () => {
    // Perform logout actions, such as clearing session or token
    localStorage.removeItem('authToken');
    router.push('/');
  };

  const goToReports = () => {
    // Navigate to the reports page
    router.push('/reports');
  };

  const goToAdmin = () => {
    // Navigate to the reports page
    router.push('/admin');
  };

  return (
    <div className="min-h-screen bg-gray-800 text-white flex flex-col p-4">
      <div className="flex justify-end space-x-4">
      <button
          onClick={goToAdmin}
          className="text-white p-2 hover:text-blue-500"
        >
          Admin
        </button>
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
      <div className="mt-4">
        <RoomAvailability />
        <AddGuest/>
        <BookedGuestList/>
        <CheckedInGuestList/>
        <CheckedOutGuestList/>
      </div>
      <div className="flex flex-col items-center justify-center flex-grow">
      </div>
    </div>
  );
};

export default withAuth(WelcomePage);
