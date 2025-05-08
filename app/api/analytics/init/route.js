import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import MockAnalytics from '@/app/models/MockAnalytics';
import { generateMockData } from '@/app/lib/mockData';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function POST() {
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

    // Clear existing mock data for this user only
    await MockAnalytics.deleteMany({ userId });

    // Generate and save mock data for each platform
    const platforms = ['youtube', 'instagram', 'tiktok'];
    const mockData = [];
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30); // Generate 30 days of data

    for (const platform of platforms) {
      const platformData = generateMockData(platform, startDate, endDate);
      const formattedData = platformData.map(item => ({
        userId,
        platform,
        date: new Date(item.date),
        isConnected: true,
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