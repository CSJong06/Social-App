import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import MockAnalytics from '@/app/models/MockAnalytics';
import { generateMockSummary } from '@/app/lib/mockData';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function GET(request, { params }) {
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

    const { platform } = params;
    
    // Validate platform
    const validPlatforms = ['youtube', 'instagram', 'tiktok'];
    if (!validPlatforms.includes(platform)) {
      return NextResponse.json(
        { error: 'Invalid platform' },
        { status: 400 }
      );
    }

    await connectDB();

    // Get analytics data for the platform and user
    const analytics = await MockAnalytics.find({ 
      platform,
      userId
    })
      .sort({ date: 1 })
      .select('-_id -__v');

    // Get summary data
    const summary = generateMockSummary(platform);

    return NextResponse.json({
      analytics,
      summary
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 