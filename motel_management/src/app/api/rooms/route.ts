// pages/api/rooms.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const rooms = await prisma.room.findMany({
      select: {
        number: true,
        status: true,
      },
    });

    if (rooms.length === 0) {
      return NextResponse.json(
        { error: 'No rooms found' },
        { status: 404 }
      );
    }

    return NextResponse.json(rooms);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return new Response(JSON.stringify({ error: 'Error fetching rooms' }), {
      status: 500,
    });
  }
}
