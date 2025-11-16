import { NextRequest, NextResponse } from 'next/server';
import { getParentByEmail, verifyPassword } from '@/lib/parentStorage';
import { createSession } from '@/lib/sessionStorage';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find parent
    const parent = await getParentByEmail(email.toLowerCase().trim());
    if (!parent) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    if (!verifyPassword(password, parent.passwordHash)) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Create session
    const sessionId = await createSession(parent.id, parent.email, parent.name);

    // Set session cookie
    const response = NextResponse.json(
      { 
        success: true, 
        parent: {
          id: parent.id,
          name: parent.name,
          email: parent.email,
        }
      }
    );

    response.cookies.set('sessionId', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error('Error in login:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to login' },
      { status: 500 }
    );
  }
}


