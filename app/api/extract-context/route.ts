import { companyContextMakingLLM } from '@/lib/contextMaker';
import { NextResponse, NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        // Validate request
        if (!req || !req.body) {
            return NextResponse.json(
                { error: 'Invalid request body' },
                { status: 400 }
            );
        }

        const data = await req.formData();
        const text = data.get('text');

        // Validate text input
        if (!text || typeof text.toString() !== 'string') {
            return NextResponse.json(
                { error: 'Text input is required and must be a string' },
                { status: 400 }
            );
        }

        // Trim and validate text length
        const processedText = text.toString().trim();
        if (processedText.length === 0) {
            return NextResponse.json(
                { error: 'Text input cannot be empty' },
                { status: 400 }
            );
        }

        // Process text through LLM
        const result = await companyContextMakingLLM(processedText);
        
        if (!result) {
            return NextResponse.json(
                { error: 'Failed to process text' },
                { status: 500 }
            );
        }

        return NextResponse.json({ 
            success: true,
            data: result 
        }, { 
            status: 200 
        });

    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({ 
            success: false,
            error: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { 
            status: 500 
        });
    }
}
