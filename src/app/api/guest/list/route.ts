import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const guests = await prisma.guest.findMany({
            include: {
                room: true, // Include room information if you have a relation between guest and room
            },
        });

        return NextResponse.json(guests);
    } catch (error) {
        console.error('Error fetching guests:', error);
        return NextResponse.json({ error: 'Error fetching guests' }, { status: 500 });
    }
}
