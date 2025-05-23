import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import MockAnalytics from '@/app/models/MockAnalytics';
import User from '@/app/models/User';
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

    // Remove platform from connectedPlatforms
    user.connectedPlatforms = user.connectedPlatforms.filter(p => p !== platform);
    await user.save();

    // Delete all analytics data for this platform and user
    await MockAnalytics.deleteMany({ 
      platform,
      userId 
    });

    return NextResponse.json({ 
      success: true,
      message: `${platform} disconnected successfully`,
      connectedPlatforms: user.connectedPlatforms
    });
  } catch (error) {
    console.error('Error disconnecting platform:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 