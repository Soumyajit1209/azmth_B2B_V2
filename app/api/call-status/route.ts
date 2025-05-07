import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import connectDB from '@/lib/connectDB';
import User from '@/modals/User';

export async function GET(request: NextRequest) {
  try {
    const callId = request.nextUrl.searchParams.get('callId');
    
    if (!callId) {
      return NextResponse.json({ error: 'Call ID is required' }, { status: 400 });
    }
    
    const user = await currentUser();
    const clerkId = user?.id;
    
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await connectDB();
    const userRecord = await User.findOne({ clerkId });
    
    if (!userRecord) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    const { twilioConfig } = userRecord;
    
    if (!twilioConfig) {
      return NextResponse.json({ error: 'Twilio configuration not found' }, { status: 404 });
    }
    
    // Call the Vapi API to get call status
    const response = await fetch(`https://api.vapi.ai/call/${callId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.VAPI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json({ error: data.message || 'Failed to get call status' }, { status: response.status });
    }
    
    return NextResponse.json({
      callId: data.id,
      status: data.status,
      duration: data.duration,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    });
    
  } catch (error) {
    console.error('Error getting call status:', error);
    return NextResponse.json({ error: 'Failed to get call status' }, { status: 500 });
  }
}