import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(
  req: Request,
  { params }: { params: { id: string; attemptId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "You must be logged in to submit a quiz" },
        { status: 401 }
      );
    }

    const quizId = params.id;
    const attemptId = params.attemptId;
    const userId = session.user.id;
    
    console.log(`Submitting quiz ${quizId} attempt ${attemptId} for user ${userId}`);
    
    // Verify the attempt belongs to the user
    const attempt = await prisma.quizAttempt.findFirst({
      where: {
        id: attemptId,
        userId,
        quizId,
      },
      include: {
        quiz: true,
      },
    });

    if (!attempt) {
      console.log(`Quiz attempt ${attemptId} not found for user ${userId}`);
      return NextResponse.json(
        { error: "Quiz attempt not found" },
        { status: 404 }
      );
    }

    if (attempt.submitted) {
      console.log(`Quiz attempt ${attemptId} has already been submitted`);
      return NextResponse.json(
        { error: "Quiz has already been submitted" },
        { status: 400 }
      );
    }

    // Get the answers from the request body
    const body = await req.json();
    const { answers } = body;
    
    console.log(`Received answers:`, answers);

    // Get all questions for this quiz
    const questions = await prisma.question.findMany({
      where: { quizId },
      include: {
        options: true,
      },
    });

    console.log(`Found ${questions.length} questions for quiz ${quizId}`);

    let totalPoints = 0;
    let earnedPoints = 0;
    const gradedAnswers = [];

    // Process each answer
    for (const answer of answers) {
      const question = questions.find(q => q.id === answer.questionId);
      if (!question) continue;

      totalPoints += question.points;
      let feedback = '';
      let earnedPointsForQuestion = 0;

      if (question.type === 'MULTIPLE_CHOICE' || question.type === 'TRUE_FALSE') {
        // Handle multiple choice questions
        const correctOption = question.options.find(o => o.isCorrect);
        const isCorrect = correctOption?.id === answer.selectedOptionId;
        if (isCorrect) {
          earnedPointsForQuestion = question.points;
          feedback = 'Correct answer!';
        } else {
          feedback = `Incorrect. The correct answer was: ${correctOption?.text}`;
        }
      } else if (question.type === 'SHORT_ANSWER' || question.type === 'ESSAY') {
        // Use AI to grade text responses
        const correctAnswer = question.options.find(o => o.isCorrect)?.text || '';
        
        const completion = await openai.chat.completions.create({
          messages: [
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
              content: `Question: ${question.text}\nStudent's Response: ${answer.text || 'No answer provided'}\nExpected Key Points: ${correctAnswer}`
            }
          ],
          model: 'gpt-4',
          temperature: 0.3,
          max_tokens: 500,
        });

        feedback = completion.choices[0].message.content || '';
        
        // Extract score from feedback (assuming it's in the format "Score: X points")
        const scoreMatch = feedback.match(/(\d+)\s*points?/i);
        const aiScore = scoreMatch ? parseInt(scoreMatch[1]) : 0;
        
        // Calculate earned points based on AI score
        const pointsPerAIScore = question.points / 2; // 2 is max AI score
        earnedPointsForQuestion = aiScore * pointsPerAIScore;
      }

      earnedPoints += earnedPointsForQuestion;

      // Save the graded answer
      gradedAnswers.push({
        questionId: question.id,
        attemptId,
        selectedOptionId: answer.selectedOptionId || null,
        text: answer.text || null,
        feedback,
      });
    }

    // Calculate final score as percentage
    const scorePercentage = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
    
    console.log(`Score calculation: ${earnedPoints}/${totalPoints} = ${scorePercentage}%`);

    // Update the attempt with the score and mark as completed
    const updatedAttempt = await prisma.quizAttempt.update({
      where: { id: attemptId },
      data: {
        score: scorePercentage,
        submitted: true,
        completedAt: new Date(),
      },
    });

    console.log(`Updated attempt: ${JSON.stringify(updatedAttempt)}`);

    // Save all graded answers
    await prisma.answer.createMany({
      data: gradedAnswers,
    });

    return NextResponse.json({
      message: "Quiz submitted successfully",
      score: scorePercentage,
      attemptId,
    });
  } catch (error) {
    console.error("Quiz submission error:", error);
    return NextResponse.json(
      { error: "Something went wrong", details: error },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';