import { PrismaClient, QuestionType } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedDatabase() {
  try {
    console.log('Starting database seed...');

    // Create admin user
    const admin = await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'ADMIN',
      },
    });

    console.log('Created admin user:', admin.email);

    // Create a sample course
    const course = await prisma.course.create({
      data: {
        title: 'Strat-Ops',
        description: 'Learn the fundamentals of Strat-Ops',
        imageUrl: '/images/course-1.jpg',
      },
    });

    console.log('Created course:', course.title);

    // Create a quiz with various question types
    const quiz = await prisma.quiz.create({
      data: {
        title: 'Supply Chain Fundamentals',
        description: 'Test your knowledge of supply chain basics',
        timeLimit: 30,
        passingScore: 70,
        courseId: course.id,
        questions: {
          create: [
            {
              text: 'What is the primary goal of Strat-Ops?',
              type: QuestionType.MULTIPLE_CHOICE,
              points: 10,
              options: {
                create: [
                  { text: 'Maximize profit only', isCorrect: false },
                  { text: 'Optimize flow of goods and services', isCorrect: true },
                  { text: 'Reduce costs only', isCorrect: false },
                  { text: 'Increase inventory', isCorrect: false },
                ],
              },
            },
            {
              text: 'Explain the concept of Just-In-Time (JIT) inventory.',
              type: QuestionType.ESSAY,
              points: 20,
              options: {
                create: [
                  {
                    text: 'JIT is an inventory strategy that receives goods only as they are needed in the production process, reducing inventory costs. Key points: timing of deliveries, reduced storage costs, quality control, and relationship with suppliers.',
                    isCorrect: true,
                  },
                ],
              },
            },
            {
              text: 'What is the bullwhip effect in supply chain?',
              type: QuestionType.SHORT_ANSWER,
              points: 15,
              options: {
                create: [
                  {
                    text: 'The bullwhip effect is when small changes in consumer demand cause progressively larger fluctuations in inventory needs upstream in the supply chain.',
                    isCorrect: true,
                  },
                ],
              },
            },
          ],
        },
      },
    });

    console.log('Created quiz:', quiz.title);
    console.log('Database seeding completed successfully');
    
    return { success: true, message: 'Database seeded successfully' };
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
} 