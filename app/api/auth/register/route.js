import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '../../../lib/mongodb';
import User from '../../../models/User';
import mongoose from 'mongoose';

export async function POST(request) {
  try {
    await connectDB();

    const { username, email, password } = await request.json();

    // Validate input
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Please provide all required fields' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }]
    });
    
    if (existingUser) {
      return NextResponse.json(
        { error: existingUser.email === email ? 'Email already registered' : 'Username already taken' },
        { status: 400 }
      );
    }

    // Create new user
    const user = await User.create({
      username,
      email,
      password,
    });

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Return success response
    return NextResponse.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 