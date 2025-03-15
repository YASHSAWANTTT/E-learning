import { PrismaClient, QuestionType } from '@prisma/client';
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function seedDatabase() {
  try {
    console.log("Starting database seeding...");
    
    // Check if admin user exists
    const adminExists = await prisma.user.findFirst({
      where: { role: "ADMIN" }
    });

    if (!adminExists) {
      console.log("Creating admin user...");
      // Create admin user
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await prisma.user.create({
        data: {
          name: "Admin User",
          email: "admin@example.com",
          password: hashedPassword,
          role: "ADMIN",
        }
      });
      console.log("Admin user created successfully");
    } else {
      console.log("Admin user already exists");
    }

    // Check if sample courses exist
    const coursesExist = await prisma.course.findFirst();
    
    if (!coursesExist) {
      console.log("Creating sample courses...");
      
      // Create first course
      const webDevCourse = await prisma.course.create({
        data: {
          title: "Introduction to Web Development",
          description: "Learn the basics of HTML, CSS, and JavaScript to build modern websites.",
          imageUrl: "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        }
      });
      
      // Create HTML quiz
      const htmlQuiz = await prisma.quiz.create({
        data: {
          title: "HTML Fundamentals",
          description: "Test your knowledge of HTML tags, attributes, and document structure.",
          timeLimit: 20,
          passingScore: 70,
          courseId: webDevCourse.id
        }
      });
      
      // Create questions for HTML quiz
      const htmlQuestion1 = await prisma.question.create({
        data: {
          text: "What does HTML stand for?",
          type: QuestionType.MULTIPLE_CHOICE,
          points: 1,
          quizId: htmlQuiz.id
        }
      });
      
      // Create options for question 1
      await prisma.questionOption.createMany({
        data: [
          { text: "Hyper Text Markup Language", isCorrect: true, questionId: htmlQuestion1.id },
          { text: "Hyper Transfer Markup Language", isCorrect: false, questionId: htmlQuestion1.id },
          { text: "Hyper Text Markdown Language", isCorrect: false, questionId: htmlQuestion1.id },
          { text: "High Tech Markup Language", isCorrect: false, questionId: htmlQuestion1.id }
        ]
      });
      
      const htmlQuestion2 = await prisma.question.create({
        data: {
          text: "Which tag is used to create a hyperlink?",
          type: QuestionType.MULTIPLE_CHOICE,
          points: 1,
          quizId: htmlQuiz.id
        }
      });
      
      // Create options for question 2
      await prisma.questionOption.createMany({
        data: [
          { text: "<a>", isCorrect: true, questionId: htmlQuestion2.id },
          { text: "<link>", isCorrect: false, questionId: htmlQuestion2.id },
          { text: "<href>", isCorrect: false, questionId: htmlQuestion2.id },
          { text: "<url>", isCorrect: false, questionId: htmlQuestion2.id }
        ]
      });

      // Add a true/false question
      const htmlQuestion3 = await prisma.question.create({
        data: {
          text: "HTML5 is the latest version of HTML.",
          type: QuestionType.TRUE_FALSE,
          points: 1,
          quizId: htmlQuiz.id
        }
      });

      await prisma.questionOption.createMany({
        data: [
          { text: "True", isCorrect: true, questionId: htmlQuestion3.id },
          { text: "False", isCorrect: false, questionId: htmlQuestion3.id }
        ]
      });

      // Add a short answer question
      const htmlQuestion4 = await prisma.question.create({
        data: {
          text: "What is the purpose of the DOCTYPE declaration in HTML?",
          type: QuestionType.SHORT_ANSWER,
          points: 2,
          quizId: htmlQuiz.id
        }
      });

      await prisma.questionOption.create({
        data: {
          text: "The DOCTYPE declaration specifies the HTML version and helps browsers render the page correctly. It must be the first line of an HTML document and ensures proper rendering and validation of the HTML document.",
          isCorrect: true,
          questionId: htmlQuestion4.id
        }
      });

      // Add an essay question
      const htmlQuestion5 = await prisma.question.create({
        data: {
          text: "Explain the importance of semantic HTML and provide three examples of semantic elements and their proper usage.",
          type: QuestionType.ESSAY,
          points: 3,
          quizId: htmlQuiz.id
        }
      });

      await prisma.questionOption.create({
        data: {
          text: "Semantic HTML provides meaning and structure to web content, making it more accessible and SEO-friendly. Examples include: 1) <nav> for navigation menus, 2) <article> for self-contained content like blog posts, and 3) <header> for introductory content. These elements help screen readers, search engines, and developers better understand the page structure and content hierarchy.",
          isCorrect: true,
          questionId: htmlQuestion5.id
        }
      });
      
      // Create CSS quiz with mixed question types
      const cssQuiz = await prisma.quiz.create({
        data: {
          title: "CSS Fundamentals",
          description: "Test your understanding of CSS selectors, properties, and layouts.",
          timeLimit: 25,
          passingScore: 70,
          courseId: webDevCourse.id
        }
      });

      // Multiple choice question for CSS
      const cssQuestion1 = await prisma.question.create({
        data: {
          text: "Which CSS property is used to change the text color?",
          type: QuestionType.MULTIPLE_CHOICE,
          points: 1,
          quizId: cssQuiz.id
        }
      });

      await prisma.questionOption.createMany({
        data: [
          { text: "color", isCorrect: true, questionId: cssQuestion1.id },
          { text: "text-color", isCorrect: false, questionId: cssQuestion1.id },
          { text: "font-color", isCorrect: false, questionId: cssQuestion1.id },
          { text: "text-style", isCorrect: false, questionId: cssQuestion1.id }
        ]
      });

      // Essay question for CSS
      const cssQuestion2 = await prisma.question.create({
        data: {
          text: "Explain the CSS Box Model and how it affects layout. Include descriptions of content, padding, border, and margin.",
          type: QuestionType.ESSAY,
          points: 3,
          quizId: cssQuiz.id
        }
      });

      await prisma.questionOption.create({
        data: {
          text: "The CSS Box Model is fundamental to web layout. It consists of: 1) Content - the actual content area, 2) Padding - clear space around the content, 3) Border - a line around the padding, and 4) Margin - clear space outside the border. Each element affects the total size and spacing of elements on the page. Understanding the box model is crucial for creating precise layouts and managing element spacing effectively.",
          isCorrect: true,
          questionId: cssQuestion2.id
        }
      });
      
      // Create second course
      const dataScienceCourse = await prisma.course.create({
        data: {
          title: "Data Science Fundamentals",
          description: "Explore the world of data analysis, visualization, and machine learning.",
          imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        }
      });
      
      // Create Python quiz with mixed question types
      const pythonQuiz = await prisma.quiz.create({
        data: {
          title: "Python Programming Basics",
          description: "Test your understanding of Python fundamentals and data structures.",
          timeLimit: 30,
          passingScore: 75,
          courseId: dataScienceCourse.id
        }
      });

      // Multiple choice question
      const pythonQuestion1 = await prisma.question.create({
        data: {
          text: "Which of the following is a mutable data type in Python?",
          type: QuestionType.MULTIPLE_CHOICE,
          points: 1,
          quizId: pythonQuiz.id
        }
      });

      await prisma.questionOption.createMany({
        data: [
          { text: "list", isCorrect: true, questionId: pythonQuestion1.id },
          { text: "tuple", isCorrect: false, questionId: pythonQuestion1.id },
          { text: "string", isCorrect: false, questionId: pythonQuestion1.id },
          { text: "int", isCorrect: false, questionId: pythonQuestion1.id }
        ]
      });

      // Short answer question
      const pythonQuestion2 = await prisma.question.create({
        data: {
          text: "What is the difference between a list and a tuple in Python?",
          type: QuestionType.SHORT_ANSWER,
          points: 2,
          quizId: pythonQuiz.id
        }
      });

      await prisma.questionOption.create({
        data: {
          text: "Lists are mutable (can be modified after creation) while tuples are immutable (cannot be modified after creation). Lists use square brackets [] and tuples use parentheses (). Lists generally use more memory than tuples and are slower to process.",
          isCorrect: true,
          questionId: pythonQuestion2.id
        }
      });
      
      // Create third course
      await prisma.course.create({
        data: {
          title: "Mobile App Development",
          description: "Build cross-platform mobile applications using React Native.",
          imageUrl: "https://images.unsplash.com/photo-1526498460520-4c246339dccb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
        }
      });
      
      console.log("Sample courses created successfully");
    } else {
      console.log("Sample courses already exist");
    }

    console.log("Database seeding completed successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();