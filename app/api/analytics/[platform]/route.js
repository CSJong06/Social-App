import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import MockAnalytics from '@/app/models/MockAnalytics';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    const platform = params.platform;
    
    // Validate platform
    if (!['youtube', 'instagram', 'tiktok'].includes(platform)) {
      return NextResponse.json(
        { error: 'Invalid platform' },
        { status: 400 }
      );
    }

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

    // Get analytics data for the platform
    const analytics = await MockAnalytics.find({ 
      platform,
      userId
    })
      .sort({ date: -1 })
      .limit(30);

    if (!analytics || analytics.length === 0) {
      return NextResponse.json(
        { error: 'No analytics data found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ analytics });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 