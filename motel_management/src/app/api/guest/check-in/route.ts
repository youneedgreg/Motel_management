// pages/api/guests/check-in.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request) {
    try {
        const { guestId } = await request.json(); // Assuming we send guestId in the request body

        // Find the guest by ID and check if they're "booked"
        const guest = await prisma.guest.findUnique({
            where: { id: guestId },
            select: {
                id: true,
                status: true,
                roomId: true,
                room: { select: { status: true } },
            },
        });

        if (!guest) {
            return NextResponse.json({ error: 'Guest not found' }, { status: 404 });
        }

        if (guest.status !== 'booked') {
            return NextResponse.json({ error: 'Guest status must be "booked" to check in' }, { status: 400 });
        }

        // Update guest status to "checked-in" and room status to "occupied"
        const updatedGuest = await prisma.guest.update({
            where: { id: guestId },
            data: {
                status: 'checked-in',
                room: {
                    update: {
                        status: 'occupied',
                    },
                },
            },
            include: { room: true },
        });

        return NextResponse.json({
            message: 'Guest checked in successfully',
            guest: updatedGuest,
        });
    } catch (error) {
        console.error('Error updating guest status:', error);
        return NextResponse.json(
            { error: 'Error updating guest status' },
            { status: 500 }
        );
    }
}
