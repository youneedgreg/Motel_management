import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const data = await request.json();
        console.log('Received data:', data); // Log the data to see if it’s coming through

        const {
            fullName,
            telephoneNo,
            email,
            idOrPassportNo,
            paymentMethod,
            roomId,
            paymentAmount,
            modeOfPayment,
            transactionOrReceipt,
            checkIn,       // Added checkIn
            checkOut,      // Added checkOut
        } = data;

        const guest = await prisma.guest.create({
            data: {
                fullName,
                telephoneNo,
                email,
                idOrPassportNo,
                paymentMethod,
                roomId, // Pass roomId directly if it's already a string in ObjectId format
                paymentAmount,
                modeOfPayment,
                transactionOrReceipt,
                checkIn: new Date(checkIn), // Convert to Date type
                checkOut: new Date(checkOut), // Convert to Date type
            },
        });

        await prisma.room.update({
            where: { id: roomId },
            data: { status: 'booked' },
        });

        return NextResponse.json(guest);
    } catch (error) {
        console.error('Error adding guest:', error);
        return NextResponse.json({ error: 'Error adding guest' }, { status: 500 });
    }
}
