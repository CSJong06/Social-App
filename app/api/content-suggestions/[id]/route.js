import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import connectDB from '@/app/lib/mongodb';
import ContentSuggestion from '@/app/models/ContentSuggestion';

export async function PUT(request, { params }) {
  try {
    // Get the token from cookies
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token');

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Verify the token
    const decoded = jwt.verify(token.value, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const { id } = params;
    const { title, description, platform, tone } = await request.json();
    
    await connectDB();

    const suggestion = await ContentSuggestion.findOneAndUpdate(
      { _id: id, userId },
      { 
        title, 
        description, 
        platform, 
        tone,
        status: 'edited'
      },
      { new: true }
    );

    if (!suggestion) {
      return NextResponse.json({ error: 'Suggestion not found' }, { status: 404 });
    }

    return NextResponse.json({ suggestion });
  } catch (error) {
    console.error('Error updating content suggestion:', error);
    return NextResponse.json(
      { error: 'Failed to update content suggestion' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    // Get the token from cookies
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token');

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Verify the token
    const decoded = jwt.verify(token.value, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const { id } = params;
    
    await connectDB();

    const suggestion = await ContentSuggestion.findOneAndUpdate(
      { _id: id, userId },
      { status: 'deleted' },
      { new: true }
    );

    if (!suggestion) {
      return NextResponse.json({ error: 'Suggestion not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Suggestion deleted successfully' });
  } catch (error) {
    console.error('Error deleting content suggestion:', error);
    return NextResponse.json(
      { error: 'Failed to delete content suggestion' },
      { status: 500 }
    );
  }
} 