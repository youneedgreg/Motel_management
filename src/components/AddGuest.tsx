"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

const AddGuest = () => {
  const [rooms, setRooms] = useState([]);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch('/api/rooms');
        const data = await response.json();
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

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (!value) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: `${name} is required` }));
    } else {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

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
      roomId: form.roomId.value,
      paymentAmount: parseFloat(form.paymentAmount.value),
      modeOfPayment: form.modeOfPayment.value,
      transactionOrReceipt: form.transactionOrReceipt.value,
      checkIn: form.checkIn.value,
      checkOut: form.checkOut.value,
      status: form.status.value,
    };

    const hasEmptyFields = Object.keys(formData).some((key) => !formData[key]);

    if (hasEmptyFields) {
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
      if (!response.ok) throw new Error(data.error || 'Error adding guest');

      setIsError(false);
      form.reset();

      toast({
        title: "Guest added successfully",
        description: "The guest has been registered.",
        status: "success",
      });

      router.push('/welcome');
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
                {[
                  { id: 'fullName', label: 'Full Name', type: 'text' },
                  { id: 'telephoneNo', label: 'Telephone Number', type: 'text' },
                  { id: 'email', label: 'Email', type: 'email' },
                  { id: 'idOrPassportNo', label: 'ID or Passport Number', type: 'text' },
                  { id: 'checkIn', label: 'Check-In Date', type: 'date' },
                  { id: 'checkOut', label: 'Check-Out Date', type: 'date' },
                ].map(({ id, label, type }) => (
                  <div className="space-y-2" key={id}>
                    <Label htmlFor={id}>{label}</Label>
                    <Input
                      id={id}
                      name={id}
                      type={type}
                      placeholder={`Enter ${label.toLowerCase()}`}
                      onBlur={handleBlur}
                    />
                    {errors[id] && <p className="text-red-500 text-sm">{errors[id]}</p>}
                  </div>
                ))}

                {[
                  { id: 'paymentAmount', label: 'Payment Amount', type: 'number', step: '0.01' },
                  { id: 'paymentMethod', label: 'Payment Method', options: ['physical', 'online'] },
                  { id: 'modeOfPayment', label: 'Mode of Payment', options: ['mpesa', 'cash'] },
                  { id: 'transactionOrReceipt', label: 'Transaction/Receipt Number', type: 'text' },
                ].map(({ id, label, type, step, options }) => (
                  <div className="space-y-2" key={id}>
                    <Label htmlFor={id}>{label}</Label>
                    {options ? (
                      <select
                        id={id}
                        name={id}
                        onBlur={handleBlur}
                        className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded"
                      >
                        <option value="">Select {label}</option>
                        {options.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <Input
                        id={id}
                        name={id}
                        type={type}
                        step={step}
                        placeholder={`Enter ${label.toLowerCase()}`}
                        onBlur={handleBlur}
                      />
                    )}
                    {errors[id] && <p className="text-red-500 text-sm">{errors[id]}</p>}
                  </div>
                ))}

                {[
                  { id: 'roomId', label: 'Room', options: rooms.map(room => ({ value: room.id, label: `Room ${room.number}` })) },
                  { id: 'status', label: 'Status', options: ['booked', 'on-site', 'check-out'] },
                ].map(({ id, label, options }) => (
                  <div className="space-y-2" key={id}>
                    <Label htmlFor={id}>{label}</Label>
                    <select
                      id={id}
                      name={id}
                      onBlur={handleBlur}
                      className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded"
                    >
                      <option value="">Select {label}</option>
                      {options.map((option) => (
                        <option key={option.value || option} value={option.value || option}>
                          {option.label || option}
                        </option>
                      ))}
                    </select>
                    {errors[id] && <p className="text-red-500 text-sm">{errors[id]}</p>}
                  </div>
                ))}

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