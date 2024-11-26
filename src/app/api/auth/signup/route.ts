import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    // Ensure the request body exists and is valid JSON
    if (!request.body) {
      return NextResponse.json(
        { error: 'Request body is missing' },
        { status: 400 }
      );
    }

    const body = await request.json();

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Invalid request payload' },
        { status: 400 }
      );
    }

    const { name, empId, email, phone, address, password } = body;

    // Validate required fields
    if (!name || !empId || !email || !phone || !address || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
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

    // Check if the email is valid
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if user already exists by email or employee ID
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

    // Prepare the result (excluding password)
    const result = { ...user };
    delete result.password;

    // Return the created user data
    return NextResponse.json(result);
  } catch (error) {
    // Check if error is an object before logging
    if (error instanceof Error) {
      console.error('User creation error:', error.message);  // Log the error message
    } else {
      console.error('User creation error: Unknown error'); // In case the error isn't an instance of Error
    }

    // Return the error response
    return NextResponse.json({ error: 'Error creating user' }, { status: 500 });
  }
}
