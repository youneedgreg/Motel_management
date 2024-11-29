"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useReactToPrint } from 'react-to-print';
import Image from 'next/image'; // Add this import for Next.js Image component
import GuestList from '@/components/GuestList';
import withAuth from '@/hooks/withauth';

// Define types to remove 'any'
type ReportData = {
  sales: number;
  guestCount: number;
  bookedRooms: number;
  occupiedRooms: number;
  guestDetails: GuestDetail[];
};

type GuestDetail = {
  fullName: string;
  room: { number: string };
  checkIn: string;
  checkOut: string;
  paymentAmount: number;
};

const ReportPage: React.FC = () => {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [period, setPeriod] = useState('daily');

  // Create ref for the report section
  const reportRef = useRef<HTMLDivElement>(null);

  const fetchReportData = async () => {
    const res = await fetch(`/api/sales?period=${period}`);
    const data = await res.json();
    setReportData(data);
  };

  useEffect(() => {
    fetchReportData();
  }, [period, fetchReportData]); // Add fetchReportData to dependency array

  // Use contentRef in useReactToPrint hook
  const handlePrint = useReactToPrint({
    contentRef: reportRef, // Pass the ref here directly
  });

  return (
    <div className="p-4 bg-white text-gray-800 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <Link href="/welcome" passHref>
          <button className="bg-gray-500 text-white px-4 py-2 rounded">
            Back to Welcome
          </button>
        </Link>
        <h1 className="text-2xl font-bold">Report</h1>
        <button onClick={handlePrint} className="bg-blue-500 text-white px-4 py-2 rounded">
          Print as PDF
        </button>
      </div>

      <div className="flex gap-4 mb-4">
        <button onClick={() => setPeriod('daily')} className={`p-2 ${period === 'daily' ? 'bg-gray-300' : ''}`}>
          Daily
        </button>
        <button onClick={() => setPeriod('weekly')} className={`p-2 ${period === 'weekly' ? 'bg-gray-300' : ''}`}>
          Weekly
        </button>
        <button onClick={() => setPeriod('monthly')} className={`p-2 ${period === 'monthly' ? 'bg-gray-300' : ''}`}>
          Monthly
        </button>
      </div>

      <div id="report-section" ref={reportRef} className="bg-gray-100 p-4 rounded-md">
        {reportData ? (
          <div>
            <div className="flex items-center mb-6">
              <Image
                src="https://sevendaysinn.co.ke/wp-content/uploads/2024/10/7di-2-180x78.png"
                alt="Logo"
                width={180}
                height={78}
                className="w-40 h-20 mr-4"
                style={{ backgroundColor: 'gray' }}
              />

              <div>
                <p className="text-lg font-bold">Seven Days Holiday Inn</p>
                <p className="text-sm">Langata, Quincy Mall Area Near Langata Women&apos;s Prison</p>
                <p className="text-sm">P.O Box 22908 – 00505 Nairobi</p>
                <p className="text-sm">Phone: +254 759 888 555</p>
                <p className="text-sm">Email: reservations@sevendaysinn.co.ke</p>
              </div>
            </div>
            <h2 className="text-xl font-semibold mb-4">
              Period: {period.charAt(0).toUpperCase() + period.slice(1)}
            </h2>
            <p><strong>Total Sales:</strong> Ksh {reportData.sales || 0}</p>
            <p><strong>Guest Count:</strong> {reportData.guestCount || 0}</p>
            <p><strong>Booked Rooms:</strong> {reportData.bookedRooms || 0}</p>
            <p><strong>Occupied Rooms:</strong> {reportData.occupiedRooms || 0}</p>

            <h3 className="text-lg font-semibold mt-6 mb-2">Guest Details:</h3>
            <table className="w-full text-left bg-white border rounded-md">
              <thead>
                <tr className="border-b">
                  <th className="p-2">Name</th>
                  <th className="p-2">Room Number</th>
                  <th className="p-2">Check-In</th>
                  <th className="p-2">Check-Out</th>
                  <th className="p-2">Payment Amount (Ksh)</th>
                </tr>
              </thead>
              <tbody>
                {reportData.guestDetails.map((guest, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">{guest.fullName}</td>
                    <td className="p-2">{guest.room.number}</td>
                    <td className="p-2">{new Date(guest.checkIn).toLocaleDateString()}</td>
                    <td className="p-2">{new Date(guest.checkOut).toLocaleDateString()}</td>
                    <td className="p-2">Ksh {guest.paymentAmount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <GuestList/>
    </div>
  );
};

export default withAuth(ReportPage);