import { NextRequest, NextResponse } from 'next/server';
import { deleteSession } from '@/lib/sessionStorage';

export async function POST(request: NextRequest) {
  try {
    const sessionId = request.cookies.get('sessionId')?.value;

    if (sessionId) {
      await deleteSession(sessionId);
    }

    const response = NextResponse.json({ success: true });
    response.cookies.delete('sessionId');
    
    return response;
  } catch (error) {
    console.error('Error in logout:', error);
    return NextResponse.json(
      { error: 'Failed to logout' },
      { status: 500 }
    );
  }
}


