import { getServerSession } from 'next-auth';
import clientPromise from '@/app/lib/mongodb';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

// Get all projects for the authenticated user
export async function GET(request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();

    const projects = await db.collection('projects')
      .find({ userId: new ObjectId(session.user.id) })
      .sort({ updatedAt: -1 })
      .toArray();

    return NextResponse.json(projects);

  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Create a new project
export async function POST(request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, description } = await request.json();

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection('projects').insertOne({
      userId: new ObjectId(session.user.id),
      title,
      description,
      content: '',
      aiSuggestions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      collaborators: []
    });

    return NextResponse.json(
      { 
        message: 'Project created successfully',
        projectId: result.insertedId 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 