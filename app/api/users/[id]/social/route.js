import { getServerSession } from 'next-auth';
import clientPromise from '@/app/lib/mongodb';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

// Get user's social connections
export async function GET(request, { params }) {
  try {
    const session = await getServerSession();
    if (!session || session.user.id !== params.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();

    const user = await db.collection('users').findOne(
      { _id: new ObjectId(params.id) },
      { projection: { socialConnections: 1 } }
    );

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ socialConnections: user.socialConnections || [] });

  } catch (error) {
    console.error('Error fetching social connections:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Add or update social connection
export async function POST(request, { params }) {
  try {
    const session = await getServerSession();
    if (!session || session.user.id !== params.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { platform, accountId, accessToken, username } = await request.json();

    if (!platform || !accountId || !accessToken) {
      return NextResponse.json(
        { error: 'Platform, accountId, and accessToken are required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    // Update or add social connection
    const result = await db.collection('users').updateOne(
      {
        _id: new ObjectId(params.id),
        'socialConnections.platform': { $ne: platform }
      },
      {
        $push: {
          socialConnections: {
            platform,
            accountId,
            accessToken,
            username,
            connected: true,
            connectedAt: new Date()
          }
        }
      }
    );

    // If platform already exists, update it
    if (result.matchedCount === 0) {
      await db.collection('users').updateOne(
        {
          _id: new ObjectId(params.id),
          'socialConnections.platform': platform
        },
        {
          $set: {
            'socialConnections.$.accountId': accountId,
            'socialConnections.$.accessToken': accessToken,
            'socialConnections.$.username': username,
            'socialConnections.$.connected': true,
            'socialConnections.$.updatedAt': new Date()
          }
        }
      );
    }

    return NextResponse.json({
      message: 'Social connection updated successfully'
    });

  } catch (error) {
    console.error('Error updating social connection:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Remove social connection
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession();
    if (!session || session.user.id !== params.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform');

    if (!platform) {
      return NextResponse.json(
        { error: 'Platform parameter is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(params.id) },
      {
        $pull: {
          socialConnections: { platform }
        }
      }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: 'Social connection not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Social connection removed successfully'
    });

  } catch (error) {
    console.error('Error removing social connection:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 