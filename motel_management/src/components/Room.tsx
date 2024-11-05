// src/components/Room.tsx
import React from 'react';

interface RoomProps {
  number: number;
  status: string;
}

export const Room: React.FC<RoomProps> = ({ number, status }) => {
  const getBackgroundColor = () => {
    switch (status.toLowerCase()) {
      case 'free':
        return 'bg-green-500';
      case 'booked':
        return 'bg-blue-500';
      case 'occupied':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div
      className={`w-16 h-16 rounded-md m-2 flex items-center justify-center text-white font-bold ${getBackgroundColor()}`}
    >
      {number}
    </div>
  );
};

export default Room;