import { getServerSession } from 'next-auth';
import clientPromise from '@/app/lib/mongodb';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

export async function GET(request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform');
    const timeframe = searchParams.get('timeframe') || '30d'; // default to 30 days

    const client = await clientPromise;
    const db = client.db();

    // Calculate date range based on timeframe
    const now = new Date();
    const timeframeMap = {
      '7d': new Date(now.setDate(now.getDate() - 7)),
      '30d': new Date(now.setDate(now.getDate() - 30)),
      '90d': new Date(now.setDate(now.getDate() - 90)),
      '1y': new Date(now.setFullYear(now.getFullYear() - 1))
    };

    const startDate = timeframeMap[timeframe] || timeframeMap['30d'];

    // Build query
    const query = {
      userId: new ObjectId(session.user.id),
      'metrics.timestamp': { $gte: startDate }
    };

    if (platform) {
      query.platform = platform;
    }

    // Fetch analytics data
    const analytics = await db.collection('analytics')
      .aggregate([
        { $match: query },
        { $unwind: '$metrics' },
        { $match: { 'metrics.timestamp': { $gte: startDate } } },
        { $sort: { 'metrics.timestamp': 1 } },
        {
          $group: {
            _id: {
              platform: '$platform',
              date: {
                $dateToString: {
                  format: '%Y-%m-%d',
                  date: '$metrics.timestamp'
                }
              }
            },
            followers: { $last: '$metrics.followers' },
            engagement: { $last: '$metrics.engagement' },
            views: { $sum: '$dailyStats.views' },
            likes: { $sum: '$dailyStats.likes' },
            shares: { $sum: '$dailyStats.shares' }
          }
        },
        {
          $group: {
            _id: '$_id.platform',
            data: {
              $push: {
                date: '$_id.date',
                followers: '$followers',
                engagement: '$engagement',
                views: '$views',
                likes: '$likes',
                shares: '$shares'
              }
            }
          }
        }
      ])
      .toArray();

    return NextResponse.json(analytics);

  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Update analytics data
export async function POST(request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { platform, metrics, dailyStats } = await request.json();

    if (!platform || !metrics) {
      return NextResponse.json(
        { error: 'Platform and metrics are required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    const timestamp = new Date();

    // Update or create analytics document
    const result = await db.collection('analytics').updateOne(
      {
        userId: new ObjectId(session.user.id),
        platform
      },
      {
        $push: {
          metrics: {
            ...metrics,
            timestamp
          },
          dailyStats: {
            ...dailyStats,
            date: timestamp
          }
        },
        $setOnInsert: {
          userId: new ObjectId(session.user.id),
          platform,
          createdAt: timestamp
        }
      },
      { upsert: true }
    );

    return NextResponse.json({
      message: 'Analytics updated successfully',
      modified: result.modifiedCount,
      upserted: result.upsertedCount
    });

  } catch (error) {
    console.error('Error updating analytics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 