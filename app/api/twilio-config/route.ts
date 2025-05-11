// app/api/twilio-config/route.ts
import User from '@/modals/User';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/connectDB';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const clerkId = request.headers.get("x-clerk-user-id");
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await User.findOne({ clerkId });

    return NextResponse.json({
      twilioConfig: user?.twilioConfig || null,
      assistantId: user?.assistantId || null,
    });
  } catch (error) {
    console.error('Error retrieving Twilio configuration:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve Twilio configuration' },
      { status: 500 }
    );
  }
}

// export async function POST(request: NextRequest) {
//   try {
//     console.log('Connecting to the database...');
//     await connectDB();
//     console.log('Database connected successfully.');

//     console.log('Parsing request body...');
//     const { sid, authToken, phoneNumber } = await request.json();
//     console.log('Request body parsed:', { sid, authToken, phoneNumber });

//     console.log('Fetching current user...');
//     const ClerkUser = await currentUser();
//     const clerkId = ClerkUser?.id;
//     console.log('Current user fetched:', { clerkId });

//     if (!clerkId) {
//       console.error('Unauthorized access: Clerk ID not found.');
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     let assistantId;
//     try {
//       const response = await fetch(
//         `${process.env.FRONTEND_URL}/api/create-assistant`,
//         {
//           method: 'POST',
//           headers: {
//             Authorization: `Bearer ${process.env.VAPI_API_KEY}`,
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ clerkId }),
//         }
//       );

//       if (!response.ok) {
//         const errorData = await response.json();
//         console.error('Error creating assistant:', errorData);
//         throw new Error('Failed to create assistant');
//       }

//       const responseData = await response.json();
//       assistantId = responseData.assistantId;
//       if (!assistantId) {
//         throw new Error('assistantId missing in response');
//       }
//       console.log('Assistant created successfully with ID:', assistantId);
//     } catch (error: any) {
//       console.error('Error creating assistant:', error.message);
//       throw new Error('Failed to create assistant');
//     }

//     try {
//       const response = await fetch(
//         `${process.env.FRONTEND_URL}/api/create-number`,
//         {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             assistantId,
//             sid,
//             authToken,
//             phoneNumber,
//             clerkId,
//           }),
//         }
//       );

//       if (!response.ok) {
//         const errorData = await response.json();
//         console.error('Error creating number:', errorData);
//         throw new Error('Failed to create number');
//       }

//       const responseData = await response.json();
//       console.log('Create number API Response:', responseData);
//     } catch (error: any) {
//       console.error('Error creating number:', error.message);
//       throw new Error('Failed to create number');
//     }

//     console.log('Updating Twilio configuration for user...');
//     const user = await User.findOneAndUpdate(
//       { clerkId },
//       {
//         $set: {
//           twilioConfig: {
//             sid,
//             authToken,
//             phoneNumber
//           },
//           assistantId
//         }
//       },
//       { new: true, upsert: true }
//     );
//     console.log('Twilio configuration updated:', user);

//     console.log('Twilio configuration updated and assistant created successfully.');
//     return NextResponse.json({ 
//       message: 'Twilio configuration updated and assistant created successfully',
//       assistantId
//     });
//   } catch (error) {
//     console.error('Error updating Twilio configuration:', error);
//     return NextResponse.json({ error: 'Failed to update Twilio configuration' }, { status: 500 });
//   }
// }