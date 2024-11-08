"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useReactToPrint } from 'react-to-print';

const ReportPage: React.FC = () => {
  const [reportData, setReportData] = useState<any>(null);
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
  }, [period]);

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
                {reportData.guestDetails.map((guest: any, index: number) => (
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
    </div>
  );
};

export default ReportPage;
