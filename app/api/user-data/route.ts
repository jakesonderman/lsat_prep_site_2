import { NextResponse } from 'next/server';
import clientPromise from '../../lib/mongodb';
import { UserData } from '../../lib/models';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../lib/auth';

// Check if we're in build phase
const isBuildTime = process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build';

// Get user data
export async function GET(request: Request) {
  // During build time, return a dummy response
  if (isBuildTime) {
    return NextResponse.json({ message: 'Build time - no MongoDB connection' });
  }

  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    const client = await clientPromise;
    const db = client.db();
    
    const userData = await db.collection('userData').findOne({ userId });
    
    if (!userData) {
      // Create empty user data if it doesn't exist
      const newUserData: UserData = {
        userId,
        wrongAnswers: [],
        goals: [],
        calendarEvents: [],
        scoreRecords: [],
        lastUpdated: new Date().toISOString()
      };
      
      await db.collection('userData').insertOne(newUserData);
      return NextResponse.json(newUserData);
    }
    
    return NextResponse.json(userData);
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
  }
}

// Update user data
export async function PUT(request: Request) {
  // During build time, return a dummy response
  if (isBuildTime) {
    return NextResponse.json({ message: 'Build time - no MongoDB connection' });
  }

  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    const data = await request.json();
    
    // Validate data
    if (!data || typeof data !== 'object') {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }
    
    // Ensure userId matches session user
    if (data.userId !== userId) {
      return NextResponse.json({ error: 'User ID mismatch' }, { status: 403 });
    }
    
    const client = await clientPromise;
    const db = client.db();
    
    // Update with new data and timestamp
    const updatedData = {
      ...data,
      lastUpdated: new Date().toISOString()
    };
    
    await db.collection('userData').updateOne(
      { userId },
      { $set: updatedData },
      { upsert: true }
    );
    
    return NextResponse.json({ success: true, data: updatedData });
  } catch (error) {
    console.error('Error updating user data:', error);
    return NextResponse.json({ error: 'Failed to update user data' }, { status: 500 });
  }
} 