// pages/api/sales.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get('period') || 'daily';

  const date = new Date();
  let startDate: Date;
  if (period === 'daily') {
    startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  } else if (period === 'weekly') {
    startDate = new Date(date.setDate(date.getDate() - 7));
  } else if (period === 'monthly') {
    startDate = new Date(date.setMonth(date.getMonth() - 1));
  } else {
    return NextResponse.json({ error: 'Invalid period' }, { status: 400 });
  }

  try {
    const salesData = await prisma.guest.aggregate({
      where: { checkIn: { gte: startDate } },
      _sum: { paymentAmount: true },
      _count: { id: true },
    });

    const occupiedRooms = await prisma.room.count({
      where: { status: 'occupied' },
    });

    const bookedRooms = await prisma.room.count({
      where: { status: 'booked' },
    });

    // Fetch guest details with room information
    const guestDetails = await prisma.guest.findMany({
      where: { checkIn: { gte: startDate } },
      select: {
        fullName: true,
        checkIn: true,
        checkOut: true,
        paymentAmount: true,
        room: { select: { number: true } },
      },
    });

    return NextResponse.json({
      sales: salesData._sum.paymentAmount,
      guestCount: salesData._count.id,
      bookedRooms,
      occupiedRooms,
      guestDetails,
    });
  } catch (error) {
    console.error('Error fetching sales data:', error);
    return NextResponse.json({ error: 'Error fetching sales data' }, { status: 500 });
  }
}
