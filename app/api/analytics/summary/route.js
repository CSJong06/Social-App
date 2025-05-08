import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import MockAnalytics from '@/app/models/MockAnalytics';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

export async function GET() {
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

    // Get the latest data for each platform
    const platforms = ['youtube', 'instagram', 'tiktok'];
    const summary = {};

    for (const platform of platforms) {
      const latestData = await MockAnalytics.findOne({ 
        platform,
        userId
      })
        .sort({ date: -1 })
        .select(platform === 'youtube' ? 'subscribers' : 'followers');

      summary[platform] = {
        count: platform === 'youtube' ? latestData?.subscribers : latestData?.followers
      };
    }

    return NextResponse.json(summary);
  } catch (error) {
    console.error('Error fetching summary:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 