import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, empId, email, phone, address, password, adminPassword } = body;

    // Validate admin password
    if (adminPassword !== 'goldmine') {
      return NextResponse.json(
        { error: 'Invalid admin password' },
        { status: 400 }
      );
    }

    // Validate employee ID format
    if (!/^\d{6}$/.test(empId)) {
      return NextResponse.json(
        { error: 'Employee ID must be 6 digits' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { empId }
        ]
      }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await prisma.user.create({
      data: {
        name,
        empId,
        email,
        phone,
        address,
        password: hashedPassword,
      },
    });

    const result = { ...user };
    delete result.password;

    return NextResponse.json(result);
  } catch (error) {
    console.error('User creation error:', error);
    return NextResponse.json({ error: 'Error creating user' }, { status: 500 });
  }
}
