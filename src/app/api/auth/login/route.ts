import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { empId, password } = body

    const user = await prisma.user.findUnique({
      where: {
        empId,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      )
    }

    const result = { ...user };
    delete result.password;


    return NextResponse.json(result)
} catch (error) {
    console.error('User log in error:', error);
    return new Response(JSON.stringify({ error: 'Error creating user' }), {
      status: 500,
    });
  }
  

}