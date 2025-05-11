import User from '@/modals/User';
import { NextRequest, NextResponse } from 'next/server';

interface CallRecord {
  assistantId?: string;
  [key: string]: any;
}

export async function GET(request: NextRequest) {
  try {
    const clerkId = request.headers.get("x-clerk-user-id");
    
    if (!clerkId) {
      return NextResponse.json(
        { message: "Unauthorized access" },
        { status: 401 }
      );
    }

    const userRecord = await User.findOne({ clerkId });

    if (!userRecord) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    if (!userRecord.assistantId) {
      return NextResponse.json(
        { message: "Assistant ID not found for user" },
        { status: 404 }
      );
    }
    
    const apiKey = process.env.VAPI_API_KEY;
    if (!apiKey) {
      throw new Error('VAPI API key not configured');
    }

    const response = await fetch('https://api.vapi.ai/call', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`API request failed with status ${response.status}: ${errorData}`);
    }

    const data: CallRecord[] = await response.json();
    
    const filteredResults = data.filter(item => item.assistantId === userRecord.assistantId);

    if (filteredResults.length === 0) {
      return NextResponse.json(
        { message: "No call records found", data: [] },
        { status: 200 }
      );
    }
    
    return NextResponse.json({
      message: "Call records retrieved successfully",
      data: filteredResults
    });

  } catch (error) {
    console.error('Error in GET /api/call-records:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    
    return NextResponse.json(
      { message: 'Failed to fetch call records', error: errorMessage },
      { status: 500 }
    );
  }
}