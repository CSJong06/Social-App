import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import MockAnalytics from '@/app/models/MockAnalytics';

export async function GET() {
  try {
    await connectDB();

    // Get the latest data for each platform
    const platforms = ['youtube', 'instagram', 'tiktok'];
    const summary = {};

    for (const platform of platforms) {
      const latestData = await MockAnalytics.findOne({ platform })
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