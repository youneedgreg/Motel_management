"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast"; // Import useToast

const AddGuest = () => {
  const [rooms, setRooms] = useState([]); // State to store rooms
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast(); // Initialize toast
  const router = useRouter(); // Initialize router

  // Fetch rooms from API on component mount
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch('/api/rooms');
        const data = await response.json();

        // Filter rooms with status "free"
        const freeRooms = data.filter(room => room.status === 'free');
        setRooms(freeRooms);
      } catch (error) {
        console.error('Error fetching rooms:', error);
        setErrorMessage('Error fetching rooms');
        setIsError(true);
      }
    };

    fetchRooms();
  }, []);

  const handleAddGuest = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const form = e.target;
    const formData = {
      fullName: form.fullName.value,
      telephoneNo: form.telephoneNo.value,
      email: form.email.value,
      idOrPassportNo: form.idOrPassportNo.value,
      paymentMethod: form.paymentMethod.value,
      roomId: form.roomId.value, // Submit the room ID
      paymentAmount: parseFloat(form.paymentAmount.value),
      modeOfPayment: form.modeOfPayment.value,
      transactionOrReceipt: form.transactionOrReceipt.value,
      checkIn: form.checkIn.value,
      checkOut: form.checkOut.value,
      status: form.status.value, // Submit the status value
    };

    // Basic validation
    if (!formData.fullName || !formData.telephoneNo || !formData.email || 
        !formData.idOrPassportNo || !formData.paymentMethod || 
        !formData.roomId || !formData.paymentAmount || !formData.modeOfPayment || !formData.transactionOrReceipt ||
        !formData.checkIn || !formData.checkOut || !formData.status) {
      setErrorMessage('All fields are required');
      setIsError(true);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/guest/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error adding guest');
      }

      setIsError(false);
      form.reset();

      // Show success toast
      toast({
        title: "Guest added successfully",
        description: "The guest has been registered.",
        status: "success",
      });

      // Redirect to /welcome
      router.push('/welcome'); // Redirect to the welcome page

    } catch (error) {
      setErrorMessage(error.message || 'Error adding guest');
      setIsError(true);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-800 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Card>
          <CardHeader>
            <CardTitle>Add Guest</CardTitle>
            <CardDescription>Fill in the guest information</CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleAddGuest}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" name="fullName" type="text" placeholder="Enter full name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telephoneNo">Telephone Number</Label>
                  <Input id="telephoneNo" name="telephoneNo" type="text" placeholder="Enter telephone number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="Enter email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="idOrPassportNo">ID or Passport Number</Label>
                  <Input id="idOrPassportNo" name="idOrPassportNo" type="text" placeholder="Enter ID or passport number" />
                </div>

                {/* Payment Method Dropdown */}
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <select id="paymentMethod" name="paymentMethod" className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded">
                    <option value="">Select Payment Method</option>
                    <option value="physical">Physical</option>
                    <option value="online">Online</option>
                  </select>
                </div>

                {/* Room Selection */}
                <div className="space-y-2">
                  <Label htmlFor="roomId">Room</Label>
                  <select id="roomId" name="roomId" className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded">
                    <option value="">Select a Room</option>
                    {rooms.map(room => (
                      <option key={room.id} value={room.id}>
                        Room {room.number} {/* Show room number */}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Mode of Payment Dropdown */}
                <div className="space-y-2">
                  <Label htmlFor="modeOfPayment">Mode of Payment</Label>
                  <select id="modeOfPayment" name="modeOfPayment" className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded">
                    <option value="">Select Mode of Payment</option>
                    <option value="mpesa">M-Pesa</option>
                    <option value="cash">Cash</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentAmount">Payment Amount</Label>
                  <Input id="paymentAmount" name="paymentAmount" type="number" step="0.01" placeholder="Enter payment amount" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="transactionOrReceipt">Transaction/Receipt Number</Label>
                  <Input id="transactionOrReceipt" name="transactionOrReceipt" type="text" placeholder="Enter transaction or receipt number" />
                </div>

                {/* Check-in Date */}
                <div className="space-y-2">
                  <Label htmlFor="checkIn">Check-In Date</Label>
                  <Input id="checkIn" name="checkIn" type="date" className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded" />
                </div>

                {/* Check-out Date */}
                <div className="space-y-2">
                  <Label htmlFor="checkOut">Check-Out Date</Label>
                  <Input id="checkOut" name="checkOut" type="date" className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded" />
                </div>

                {/* Status Dropdown */}
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select id="status" name="status" className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded">
                    <option value="booked">Booked</option>
                    <option value="on-site">On-Site</option>
                    <option value="check-out">Check-Out</option>
                  </select>
                </div>

                <Button type="submit" className="w-full border border-white text-white hover:bg-white hover:text-gray-800 transition-colors duration-200" disabled={isLoading}>
                  {isLoading ? 'Loading...' : 'Add Guest'}
                </Button>
              </div>
            </form>

            {isError && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddGuest;
