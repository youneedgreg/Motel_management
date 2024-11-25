// pages/api/guest/check-out.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request) {
    try {
        const { guestId } = await request.json(); // Assuming we send guestId in the request body

        // Find the guest by ID and check if they're "checked-in"
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

        if (guest.status !== 'checked-in') {
            return NextResponse.json({ error: 'Guest status must be "checked-in" to check out' }, { status: 400 });
        }

        // Update guest status to "checked-out" and room status to "free"
        const updatedGuest = await prisma.guest.update({
            where: { id: guestId },
            data: {
                status: 'checked-out',
                room: {
                    update: {
                        status: 'free',
                    },
                },
            },
            include: { room: true },
        });

        return NextResponse.json({
            message: 'Guest checked out successfully',
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
