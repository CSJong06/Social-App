import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import MockAnalytics from '@/app/models/MockAnalytics';

export async function POST(request) {
  try {
    const { platform } = await request.json();
    
    if (!['youtube', 'instagram', 'tiktok'].includes(platform)) {
      return NextResponse.json(
        { error: 'Invalid platform' },
        { status: 400 }
      );
    }

    await connectDB();

    // Remove all data for this platform
    await MockAnalytics.deleteMany({ platform });

    return NextResponse.json({ 
      success: true,
      message: `${platform} disconnected successfully`
    });
  } catch (error) {
    console.error('Error disconnecting platform:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 