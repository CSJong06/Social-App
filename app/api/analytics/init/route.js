import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import MockAnalytics from '@/app/models/MockAnalytics';
import { generateMockData } from '@/app/lib/mockData';

export async function POST() {
  try {
    await connectDB();

    // Clear existing mock data
    await MockAnalytics.deleteMany({});

    // Generate and save mock data for each platform
    const platforms = ['youtube', 'instagram', 'tiktok'];
    const mockData = [];

    for (const platform of platforms) {
      const platformData = generateMockData(platform);
      const formattedData = platformData.map(item => ({
        platform,
        date: new Date(item.date),
        ...item
      }));
      mockData.push(...formattedData);
    }

    // Save all mock data
    await MockAnalytics.insertMany(mockData);

    return NextResponse.json({ message: 'Mock data initialized successfully' });
  } catch (error) {
    console.error('Error initializing mock data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 