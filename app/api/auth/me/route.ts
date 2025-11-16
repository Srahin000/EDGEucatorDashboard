import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/sessionStorage';
import { getParentById } from '@/lib/parentStorage';

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.cookies.get('sessionId')?.value;

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const session = await getSession(sessionId);
    if (!session) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }

    const parent = await getParentById(session.parentId);
    if (!parent) {
      return NextResponse.json(
        { error: 'Parent not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      parent: {
        id: parent.id,
        name: parent.name,
        email: parent.email,
        children: parent.children,
      },
    });
  } catch (error) {
    console.error('Error in /api/auth/me:', error);
    return NextResponse.json(
      { error: 'Failed to get user info' },
      { status: 500 }
    );
  }
}


