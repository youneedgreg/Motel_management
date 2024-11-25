"use client"

import { useEffect, useState } from "react";
import { format } from "date-fns";

// GuestList Component
const GuestList = () => {
  const [guests, setGuests] = useState<any[]>([]);
  const [selectedGuest, setSelectedGuest] = useState<any | null>(null);

  useEffect(() => {
    // Fetch guest data from your API
    const fetchGuests = async () => {
      try {
        const response = await fetch("/api/guest/list");
        const data = await response.json();
        setGuests(data); // Assuming data is an array of guest objects
      } catch (error) {
        console.error("Error fetching guest data:", error);
      }
    };
    fetchGuests();
  }, []);

  // Format date to a readable format
  const formatDate = (date: string) => format(new Date(date), "MMM dd, yyyy");

  return (
    <div className="container mx-auto p-5">
      <h2 className="text-3xl font-semibold mb-5">Guest List</h2>

      {/* Table */}
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-800">
            <tr className="bg-yellow">
              <th className="px-4 py-2 text-left">#</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Room Number</th>
              <th className="px-4 py-2 text-left">Phone</th>
              <th className="px-4 py-2 text-left">Check-in</th>
              <th className="px-4 py-2 text-left">Check-out</th>
              <th className="px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {guests.map((guest, index) => (
              <tr
                key={guest.id}
                className="cursor-pointer hover:bg-gray-50 transition-all"
                onClick={() => setSelectedGuest(guest)}
              >
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{guest.fullName}</td>
                <td className="px-4 py-2">{guest.room?.number}</td>
                <td className="px-4 py-2">{guest.telephoneNo}</td>
                <td className="px-4 py-2">{formatDate(guest.checkIn)}</td>
                <td className="px-4 py-2">{formatDate(guest.checkOut)}</td>
                <td className="px-4 py-2">{guest.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Display guest details when selected */}
      {selectedGuest && (
        <div className="mt-6 p-6 border rounded-lg shadow-lg bg-yellow">
          <h3 className="text-2xl font-bold mb-4">Guest Details</h3>
          <div className="space-y-4">
          <div className="flex items-center mb-4">
              <img
                src="https://sevendaysinn.co.ke/wp-content/uploads/2024/10/7di-2-180x78.png"
                alt="Logo"
                className="w-32 h-auto mr-4"
              />
              <div>
                <p className="text-lg font-bold">Seven Days Holiday Inn</p>
                <p className="text-sm">Langata, Quincy Mall Area</p>
                <p className="text-sm">P.O Box 22908 – 00505 Nairobi</p>
                <p className="text-sm">Phone: +254 759 888 555</p>
                <p className="text-sm">Email: reservations@sevendaysinn.co.ke</p>
              </div>
            </div>
            <div><strong>Name:</strong> {selectedGuest.fullName}</div>
            <div><strong>Email:</strong> {selectedGuest.email}</div>
            <div><strong>Room Number:</strong> {selectedGuest.room?.number}</div>
            <div><strong>Payment Method:</strong> {selectedGuest.paymentMethod}</div>
            <div><strong>Telephone:</strong> {selectedGuest.telephoneNo}</div>
            <div><strong>Check-in:</strong> {formatDate(selectedGuest.checkIn)}</div>
            <div><strong>Check-out:</strong> {formatDate(selectedGuest.checkOut)}</div>
            <div><strong>Payment Amount:</strong> {selectedGuest.paymentAmount}</div>
            <div><strong>Mode of Payment:</strong> {selectedGuest.modeOfPayment}</div>
            <div><strong>Transaction/Receipt:</strong> {selectedGuest.transactionOrReceipt}</div>
            <div><strong>Status:</strong> {selectedGuest.status}</div>
          </div>
          <button
            className="mt-4 py-2 px-4 bg-gray-800 text-white rounded-lg hover:bg-gray-700 border-2 border-yellow p-4"
            onClick={() => setSelectedGuest(null)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default GuestList;
