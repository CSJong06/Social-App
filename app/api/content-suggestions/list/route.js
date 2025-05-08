import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import connectDB from '@/app/lib/mongodb';
import ContentSuggestion from '@/app/models/ContentSuggestion';

export async function GET(request) {
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

    await connectDB();

    const suggestions = await ContentSuggestion.find({
      userId,
      status: { $ne: 'deleted' }
    }).sort({ createdAt: -1 });

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error('Error fetching content suggestions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content suggestions' },
      { status: 500 }
    );
  }
} 