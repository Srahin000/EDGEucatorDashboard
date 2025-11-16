import { NextRequest, NextResponse } from 'next/server';
import { getProfiles, addChild, saveProfiles } from '@/lib/profileStorage';
import { getCurrentParent, requireAuth } from '@/lib/auth';
import { updateParent } from '@/lib/parentStorage';
import { Child } from '@/types';

// GET /api/profiles - Get all profiles for the current parent
export async function GET(request: NextRequest) {
  try {
    const sessionId = request.cookies.get('sessionId')?.value;
    const parent = await getCurrentParent(sessionId);
    if (!parent) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get all profiles and filter by parent's children
    const data = await getProfiles();
    const parentChildren = data.children.filter(child => 
      parent.children.includes(child.id)
    );

    return NextResponse.json({ children: parentChildren, lastUpdated: data.lastUpdated });
  } catch (error) {
    console.error('Error fetching profiles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profiles' },
      { status: 500 }
    );
  }
}

// POST /api/profiles - Create or update a child profile
export async function POST(request: NextRequest) {
  try {
    const sessionId = request.cookies.get('sessionId')?.value;
    const parent = await requireAuth(sessionId);
    
    const body = await request.json();
    const child: Child = {
      id: body.id || `child-${Date.now()}`,
      name: body.name,
      age: body.age,
      avatarColor: body.avatarColor || '#3B82F6',
    };

    const savedChild = await addChild(child);
    
    // Link child to parent if not already linked
    if (!parent.children.includes(savedChild.id)) {
      await updateParent(parent.id, {
        children: [...parent.children, savedChild.id],
      });
    }

    return NextResponse.json(savedChild, { status: 201 });
  } catch (error: any) {
    console.error('Error saving profile:', error);
    if (error.message === 'Not authenticated') {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to save profile' },
      { status: 500 }
    );
  }
}

// PUT /api/profiles - Update multiple profiles
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { children } = body;

    if (!Array.isArray(children)) {
      return NextResponse.json(
        { error: 'Invalid request: children must be an array' },
        { status: 400 }
      );
    }

    await saveProfiles({ children, lastUpdated: null });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating profiles:', error);
    return NextResponse.json(
      { error: 'Failed to update profiles' },
      { status: 500 }
    );
  }
}

