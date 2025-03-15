# Strat-Ops

A comprehensive Strat-Ops with course management, quiz functionality, and Canvas LMS integration.

## Features

- **User Authentication**: Secure login and registration system
- **Course Management**: Browse, enroll in, and complete courses
- **Quiz System**: Take quizzes with different question types and get immediate feedback
- **Admin Dashboard**: Manage courses, quizzes, and users
- **Canvas LMS Integration**: Sync quiz scores with Canvas LMS (optional)
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (via Neon)
- **Authentication**: NextAuth.js
- **ORM**: Prisma

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (copy `.env.example` to `.env.local` and fill in the values)
4. Run the development server: `npm run dev`

## Environment Variables

- `DATABASE_URL`: PostgreSQL connection string (Neon DB)
- `NEXTAUTH_URL`: URL of your application
- `NEXTAUTH_SECRET`: Secret key for NextAuth.js
- `CANVAS_API_URL`: Canvas LMS API URL (optional)
- `CANVAS_API_TOKEN`: Canvas LMS API token (optional)

## Database Schema

The application uses a PostgreSQL database with the following main tables:

- `User`: User accounts and authentication
- `Course`: Course information and metadata
- `Quiz`: Quizzes associated with courses
- `Question`: Quiz questions with various types
- `QuizAttempt`: User attempts at quizzes
- `Enrollment`: User enrollments in courses

## Admin Access

Default admin credentials:
- Email: admin@example.com
- Password: admin123

## License

MIT