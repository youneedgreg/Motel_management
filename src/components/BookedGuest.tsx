"use client";

import { useEffect, useState, useRef } from "react";
import { format } from "date-fns";
import Image from "next/image";
import { useReactToPrint } from "react-to-print";

// Define interfaces for type safety
interface Room {
  number: string;
}

interface Guest {
  id: string;
  fullName: string;
  email: string;
  telephoneNo: string;
  room?: Room;
  checkIn: string;
  checkOut: string;
  status: "booked" | "checked-in" | "checked-out";
  paymentMethod: string;
  modeOfPayment: string;
  paymentAmount: number;
  transactionOrReceipt: string;
}

// GuestList Component
const BookedGuestList = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);

  // Ref for the guest details section
  const guestDetailsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch guest data from your API
    const fetchGuests = async () => {
      try {
        const response = await fetch("/api/guest/list");
        const data: Guest[] = await response.json();
        // Filter guests to only include those with status "booked"
        const bookedGuests = data.filter((guest) => guest.status === "booked");
        setGuests(bookedGuests);
      } catch (error) {
        console.error("Error fetching guest data:", error);
      }
    };
    fetchGuests();
  }, []);

  // Format date to a readable format
  const formatDate = (date: string) => format(new Date(date), "MMM dd, yyyy");

  // Function to check in a guest using only guestId
  const checkInGuest = async (guestId: string) => {
    try {
      const response = await fetch(`/api/guest/check-in`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ guestId }),
      });

      // Check for non-JSON response
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server responded with an error:", errorText);
        alert("Failed to check in guest. Please try again.");
        return;
      }

      // Process JSON response
      const result = await response.json();
      if (result.error) {
        alert(result.error);
      } else {
        setGuests((prevGuests) =>
          prevGuests.map((guest) =>
            guest.id === guestId ? { ...guest, status: "checked-in" } : guest
          )
        );
        alert(result.message);
      }
    } catch (error) {
      console.error("Error checking in guest:", error);
      alert("An error occurred while checking in the guest.");
    }
  };

  // Print guest details function
  const handlePrintReceipt = useReactToPrint({
    contentRef: guestDetailsRef, // Pass the guest details ref here
  });

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
                <td className="px-4 py-2">{guest.room?.number || 'N/A'}</td>
                <td className="px-4 py-2">{guest.telephoneNo}</td>
                <td className="px-4 py-2">{formatDate(guest.checkIn)}</td>
                <td className="px-4 py-2">{formatDate(guest.checkOut)}</td>
                <td className="px-4 py-2">{guest.status}</td>
                <td className="px-4 py-2">
                  {guest.status === "booked" && (
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        checkInGuest(guest.id);
                      }}
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
          <div ref={guestDetailsRef} className="space-y-4">
            <div className="flex items-center mb-4">
              <div className="relative w-32 h-auto mr-4">
                <Image
                  src="https://sevendaysinn.co.ke/wp-content/uploads/2024/10/7di-2-180x78.png"
                  alt="Seven Days Holiday Inn Logo"
                  layout="responsive"
                  width={180}
                  height={78}
                  objectFit="contain"
                />
              </div>
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
            <div><strong>Room Number:</strong> {selectedGuest.room?.number || 'N/A'}</div>
            <div><strong>Payment Method:</strong> {selectedGuest.paymentMethod}</div>
            <div><strong>Telephone:</strong> {selectedGuest.telephoneNo}</div>
            <div><strong>Check-in:</strong> {formatDate(selectedGuest.checkIn)}</div>
            <div><strong>Check-out:</strong> {formatDate(selectedGuest.checkOut)}</div>
            <div><strong>Payment-mode:</strong> {selectedGuest.modeOfPayment}</div>
            <div><strong>Transaction code/reciept no:</strong> {selectedGuest.transactionOrReceipt}</div>
            <div><strong>Amount:</strong> Ksh {selectedGuest.paymentAmount}</div>
            <div><strong>Status:</strong> {selectedGuest.status}</div>
          </div>
          <div className="mt-4 flex gap-4">
            <button
              className="py-2 px-4 bg-gray-800 text-white rounded-lg hover:bg-gray-700 border-2 border-yellow"
              onClick={() => setSelectedGuest(null)}
            >
              Close
            </button>
            <button
              className="py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-700"
              onClick={handlePrintReceipt}
            >
              Print Receipt
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookedGuestList;