import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import MockAnalytics from '@/app/models/MockAnalytics';
import { generateMockSummary } from '@/app/lib/mockData';

export async function GET(request, { params }) {
  try {
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

    // Get analytics data for the platform
    const analytics = await MockAnalytics.find({ platform })
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