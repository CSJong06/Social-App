import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import connectDB from '@/app/lib/mongodb';
import ContentSuggestion from '@/app/models/ContentSuggestion';

export async function POST(request) {
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

    const { title, description, platform, tone } = await request.json();
    
    await connectDB();

    const suggestion = await ContentSuggestion.create({
      userId,
      title,
      description,
      platform,
      tone
    });

    return NextResponse.json({ suggestion });
  } catch (error) {
    console.error('Error saving content suggestion:', error);
    return NextResponse.json(
      { error: 'Failed to save content suggestion' },
      { status: 500 }
    );
  }
} 