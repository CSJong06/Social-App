import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import MockAnalytics from '@/app/models/MockAnalytics';
import User from '@/app/models/User';
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

    // Update user's connected platforms
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Clear all connected platforms
    user.connectedPlatforms = [];
    await user.save();

    // Drop the entire collection to ensure a clean slate
    await MockAnalytics.collection.drop().catch(err => {
      // Ignore error if collection doesn't exist
      if (err.code !== 26) {
        throw err;
      }
    });

    return NextResponse.json({ 
      success: true,
      message: 'Database reset successfully',
      connectedPlatforms: user.connectedPlatforms
    });
  } catch (error) {
    console.error('Error resetting database:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 