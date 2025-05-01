import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import MockAnalytics from '@/app/models/MockAnalytics';
import { generateMockData } from '@/app/lib/mockData';

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

    // Check if data exists for this platform
    const existingData = await MockAnalytics.findOne({ platform });

    if (!existingData) {
      // Generate and save new mock data for this platform
      const mockData = generateMockData(platform);
      const formattedData = mockData.map(item => ({
        platform,
        date: new Date(item.date),
        ...item
      }));

      await MockAnalytics.insertMany(formattedData);
    }

    return NextResponse.json({ 
      success: true,
      message: `${platform} connected successfully`
    });
  } catch (error) {
    console.error('Error connecting platform:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 