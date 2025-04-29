import { getServerSession } from 'next-auth';
import clientPromise from '@/app/lib/mongodb';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

// Get a specific project
export async function GET(request, { params }) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();

    const project = await db.collection('projects').findOne({
      _id: new ObjectId(params.id),
      $or: [
        { userId: new ObjectId(session.user.id) },
        { collaborators: new ObjectId(session.user.id) }
      ]
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(project);

  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Update a project
export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, description, content } = await request.json();
    
    const client = await clientPromise;
    const db = client.db();

    const project = await db.collection('projects').findOne({
      _id: new ObjectId(params.id),
      userId: new ObjectId(session.user.id)
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const result = await db.collection('projects').updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          ...(title && { title }),
          ...(description && { description }),
          ...(content && { content }),
          updatedAt: new Date()
        }
      }
    );

    return NextResponse.json({ 
      message: 'Project updated successfully',
      modified: result.modifiedCount
    });

  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Delete a project
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();

    const project = await db.collection('projects').findOne({
      _id: new ObjectId(params.id),
      userId: new ObjectId(session.user.id)
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    await db.collection('projects').deleteOne({
      _id: new ObjectId(params.id)
    });

    return NextResponse.json({ 
      message: 'Project deleted successfully' 
    });

  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 