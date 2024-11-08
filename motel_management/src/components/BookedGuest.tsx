"use client"

import { useEffect, useState } from "react";
import { format } from "date-fns";

// GuestList Component
const BookedGuestList = () => {
  const [guests, setGuests] = useState<any[]>([]);
  const [selectedGuest, setSelectedGuest] = useState<any | null>(null);

  useEffect(() => {
    // Fetch guest data from your API
    const fetchGuests = async () => {
      try {
        const response = await fetch("/api/guest/list");
        const data = await response.json();
        // Filter guests to only include those with status "booked"
        const bookedGuests = data.filter((guest: any) => guest.status === "booked");
        setGuests(bookedGuests);
      } catch (error) {
        console.error("Error fetching guest data:", error);
      }
    };
    fetchGuests();
  }, []);

  // Format date to a readable format
  const formatDate = (date: string) => format(new Date(date), "MMM dd, yyyy");

  // Function to check in a guest and update room status
  const checkInGuest = async (guestId: string, roomId: string) => {
    try {
      // Update the guest and room status in the backend
      const response = await fetch(`/api/guest/check-in/${guestId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          guestStatus: "checked-in",
          roomStatus: "occupied",
          roomId: roomId,
        }),
      });

      if (response.ok) {
        // Update the status locally after a successful check-in
        setGuests(prevGuests =>
          prevGuests.map(guest =>
            guest.id === guestId ? { ...guest, status: "checked-in" } : guest
          )
        );
      } else {
        console.error("Failed to update guest and room status.");
      }
    } catch (error) {
      console.error("Error checking in guest:", error);
    }
  };

  return (
    <div className="container mx-auto p-5">
      <h2 className="text-3xl font-semibold mb-5">Booked Guest List</h2>

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
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {guests.map((guest, index) => (
              <tr
                key={guest.id}
                className="hover:bg-gray-50 transition-all"
                onClick={() => setSelectedGuest(guest)}
              >
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{guest.fullName}</td>
                <td className="px-4 py-2">{guest.room?.number}</td>
                <td className="px-4 py-2">{guest.telephoneNo}</td>
                <td className="px-4 py-2">{formatDate(guest.checkIn)}</td>
                <td className="px-4 py-2">{formatDate(guest.checkOut)}</td>
                <td className="px-4 py-2">{guest.status}</td>
                <td className="px-4 py-2">
                  {guest.status === "booked" && (
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                      onClick={() => checkInGuest(guest.id, guest.roomId)}
                    >
                      Check In
                    </button>
                  )}
                </td>
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
            <div><strong>Name:</strong> {selectedGuest.fullName}</div>
            <div><strong>Email:</strong> {selectedGuest.email}</div>
            <div><strong>Room Number:</strong> {selectedGuest.room?.number}</div>
            <div><strong>Payment Method:</strong> {selectedGuest.paymentMethod}</div>
            <div><strong>Telephone:</strong> {selectedGuest.telephoneNo}</div>
            <div><strong>Check-in:</strong> {formatDate(selectedGuest.checkIn)}</div>
            <div><strong>Check-out:</strong> {formatDate(selectedGuest.checkOut)}</div>
            <div><strong>Status:</strong> {selectedGuest.status}</div>
          </div>
          <button
            className="mt-4 py-2 px-4 bg-gray-800 text-white rounded-lg hover:bg-gray-700 border-2 border-yellow"
            onClick={() => setSelectedGuest(null)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default BookedGuestList;
