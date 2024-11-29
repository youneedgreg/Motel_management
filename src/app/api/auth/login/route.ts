import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'mySuperSecureJWTSecretKey12345!@#$%^&*()'

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { empId, password } = body;

    // Find user by employee ID
    const user = await prisma.user.findUnique({
      where: {
        empId,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    // Generate a JWT token for the authenticated user
    const token = jwt.sign(
      { id: user.id, empId: user.empId }, // Payload
      JWT_SECRET, // Secret key
      { expiresIn: '1h' } // Token expiration time
    );

    // Return the token in the response along with user info (excluding password)
    const { password: _, ...result } = user;

    return NextResponse.json({
      user: result,
      token, // Include the generated token
    });
  } catch (error) {
    console.error('User log in error:', error);
    return new Response(
      JSON.stringify({ error: 'Error during user login' }),
      {
        status: 500,
      }
    );
  }
}
