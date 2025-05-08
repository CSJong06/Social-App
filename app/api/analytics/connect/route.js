import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import MockAnalytics from '@/app/models/MockAnalytics';
import User from '@/app/models/User';
import { generateMockData } from '@/app/lib/mockData';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function POST(request) {
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

    const { platform } = await request.json();
    
    if (!['youtube', 'instagram', 'tiktok'].includes(platform)) {
      return NextResponse.json(
        { error: 'Invalid platform' },
        { status: 400 }
      );
    }

    await connectDB();

    // Update user's connected platforms
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Add platform to connectedPlatforms if not already present
    if (!user.connectedPlatforms.includes(platform)) {
      user.connectedPlatforms.push(platform);
      await user.save();
    }

    // Check if data exists for this platform and user
    const existingData = await MockAnalytics.findOne({ 
      platform,
      userId
    });

    if (!existingData) {
      // Generate and save new mock data for this platform
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30); // Generate 30 days of data
      const mockData = generateMockData(platform, startDate, endDate);
      const formattedData = mockData.map(item => ({
        userId,
        platform,
        date: new Date(item.date),
        isConnected: true,
        ...item
      }));

      // Use insertMany with ordered: false to handle potential duplicates
      await MockAnalytics.insertMany(formattedData, { ordered: false });
    } else {
      // Update all existing data for this platform to set isConnected to true
      await MockAnalytics.updateMany(
        { platform, userId },
        { $set: { isConnected: true } }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: `${platform} connected successfully`,
      connectedPlatforms: user.connectedPlatforms
    });
  } catch (error) {
    console.error('Error connecting platform:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 