import { NextRequest, NextResponse } from 'next/server';
import { addParent, hashPassword, getParentByEmail } from '@/lib/parentStorage';
import { createSession } from '@/lib/sessionStorage';
import { Parent } from '@/types/auth';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existing = await getParentByEmail(email);
    if (existing) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }

    // Create parent
    const parent: Parent = {
      id: `parent-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash: hashPassword(password),
      createdAt: new Date().toISOString(),
      children: [],
    };

    const savedParent = await addParent(parent);

    // Create session
    const sessionId = await createSession(savedParent.id, savedParent.email, savedParent.name);

    // Set session cookie
    const response = NextResponse.json(
      { 
        success: true, 
        parent: {
          id: savedParent.id,
          name: savedParent.name,
          email: savedParent.email,
        }
      },
      { status: 201 }
    );

    response.cookies.set('sessionId', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error('Error in signup:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create account' },
      { status: 500 }
    );
  }
}


