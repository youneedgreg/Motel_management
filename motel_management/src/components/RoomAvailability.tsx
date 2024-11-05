import React, { useEffect, useState } from 'react';

type RoomStatus = 'free' | 'booked' | 'occupied';

interface RoomProps {
  number: number;
  status: RoomStatus;
}

const Room: React.FC<RoomProps> = ({ number, status }) => {
  const getBackgroundColor = () => {
    switch (status) {
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

const RoomAvailability: React.FC = () => {
  const [rooms, setRooms] = useState<RoomProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch('/api/rooms'); // API call to your rooms endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch rooms');
        }
        const data = await response.json();
        setRooms(data); // Set the rooms data from the response
      } catch (err) {
        setError(err.message); // Set error if any
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchRooms();
  }, []);

  if (loading) {
    return <div>Loading rooms...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="bg-gray-800 p-4 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-4">Room Availability</h2>
      <div className="flex flex-wrap justify-center">
        {rooms.map((room) => (
          <Room key={room.number} number={room.number} status={room.status} />
        ))}
      </div>
      <div className="mt-4 flex justify-center">
        <div className="flex items-center mr-4">
          <div className="w-4 h-4 rounded-md mr-2 bg-green-500"></div>
          <span>Free</span>
        </div>
        <div className="flex items-center mr-4">
          <div className="w-4 h-4 rounded-md mr-2 bg-blue-500"></div>
          <span>Booked</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-md mr-2 bg-red-500"></div>
          <span>Occupied</span>
        </div>
      </div>
    </div>
  );
};

export default RoomAvailability;
