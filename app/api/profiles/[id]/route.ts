import { NextRequest, NextResponse } from 'next/server';
import { getChildById, deleteChild, addChild } from '@/lib/profileStorage';
import { getCurrentParent, requireAuth } from '@/lib/auth';
import { updateParent } from '@/lib/parentStorage';
import { Child } from '@/types';

// GET /api/profiles/[id] - Get a specific child profile
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = request.cookies.get('sessionId')?.value;
    const parent = await getCurrentParent(sessionId);
    if (!parent) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const child = await getChildById(params.id);
    
    if (!child) {
      return NextResponse.json(
        { error: 'Child not found' },
        { status: 404 }
      );
    }

    // Verify parent owns this child
    if (!parent.children.includes(child.id)) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    return NextResponse.json(child);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

// DELETE /api/profiles/[id] - Delete a child profile
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = request.cookies.get('sessionId')?.value;
    const parent = await requireAuth(sessionId);
    
    // Verify parent owns this child
    if (!parent.children.includes(params.id)) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    await deleteChild(params.id);
    
    // Remove child from parent's children list
    await updateParent(parent.id, {
      children: parent.children.filter(id => id !== params.id),
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting profile:', error);
    if (error.message === 'Not authenticated') {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to delete profile' },
      { status: 500 }
    );
  }
}

// PATCH /api/profiles/[id] - Update a child profile
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = request.cookies.get('sessionId')?.value;
    const parent = await requireAuth(sessionId);
    
    // Verify parent owns this child
    if (!parent.children.includes(params.id)) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const existingChild = await getChildById(params.id);

    if (!existingChild) {
      return NextResponse.json(
        { error: 'Child not found' },
        { status: 404 }
      );
    }

    const updatedChild: Child = {
      ...existingChild,
      ...body,
      id: params.id, // Ensure ID doesn't change
    };

    const savedChild = await addChild(updatedChild);
    return NextResponse.json(savedChild);
  } catch (error: any) {
    console.error('Error updating profile:', error);
    if (error.message === 'Not authenticated') {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}

