import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { question, answer, responsePrompt } = body;

    // Validate input
    if (!question || !answer || !responsePrompt) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const messages = [
      {
        role: 'system',
        content: `You are an AI tutor grading student responses. 
          Evaluate the answer based on the following rubric:
          - **2 points**: Answer is fully correct and well-explained.
          - **1 point**: Answer has relevant elements but is incomplete or somewhat incorrect.
          - **0 points**: Answer is incorrect or lacks relevance.
          
          Consider the question, the student's response, and key points for an ideal answer when grading.`
      },
      {
        role: 'user',
        content: `Question: ${question}\nStudent's Response: ${answer}\nExpected Key Points: ${responsePrompt}`
      }
    ];

    const completion = await openai.chat.completions.create({
      messages: messages as any,
      model: 'gpt-4',
      temperature: 0.3,
      max_tokens: 500,
    });

    return NextResponse.json({
      feedback: completion.choices[0].message.content,
    });
  } catch (error: any) {
    console.error('Grading error:', error);
    return NextResponse.json(
      { error: 'Failed to grade response' },
      { status: 500 }
    );
  }
} 