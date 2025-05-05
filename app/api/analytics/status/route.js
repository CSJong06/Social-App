import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import MockAnalytics from '@/app/models/MockAnalytics';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

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

    // Get the latest connection status for each platform
    const platforms = ['youtube', 'instagram', 'tiktok'];
    const status = {};

    for (const platform of platforms) {
      // Find the most recent entry for this platform and user
      const latestData = await MockAnalytics.findOne({ 
        platform,
        userId
      })
        .sort({ date: -1 })
        .select('isConnected');

      // If no data exists or isConnected is false, the platform is disconnected
      status[platform] = latestData?.isConnected === true;
    }

    return NextResponse.json(status);
  } catch (error) {
    console.error('Error fetching connection status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 