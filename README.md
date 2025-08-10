# The Last Trade - Next.js Application

A modern Next.js application with PostgreSQL database integration using Neon.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Neon PostgreSQL database

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory:
   ```env
   DATABASE_URL=postgresql://mypsdb_owner:n4v2ilwqCVWO@ep-lingering-forest-a17xlk9j-pooler.ap-southeast-1.aws.neon.tech/mypsdb?sslmode=require&channel_binding=require
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

### Database Setup

1. Test database connection:
   ```bash
   npm run db:test
   ```

2. Set up database schema:
   ```bash
   npm run db:setup
   ```

### Running the Application

1. Development mode:
   ```bash
   npm run dev
   ```

2. Production build:
   ```bash
   npm run build
   npm start
   ```

## 🗄️ Database

The application uses PostgreSQL hosted on Neon with the following tables:

- **users**: User accounts and profiles
- **courses**: Trading courses and educational content
- **features**: Application features and capabilities

### Database Utilities

- `lib/db.ts`: Database connection and query utilities
- `lib/schema.sql`: Database schema definition
- `scripts/setup-db.ts`: Database initialization script
- `scripts/test-db.ts`: Database connection test script

### API Endpoints

- `GET /api/db-test`: Test database connection and get database info

## 🛠️ Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint
- `npm run db:test`: Test database connection
- `npm run db:setup`: Initialize database schema

## 🏗️ Project Structure

```
thelasttrade_new/
├── app/                 # Next.js 13+ app directory
├── components/          # React components
├── lib/                 # Utility functions and database
├── scripts/             # Database setup scripts
├── hooks/               # Custom React hooks
└── public/              # Static assets
```

## 🔧 Technologies Used

- **Frontend**: Next.js 13+, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: PostgreSQL (Neon)
- **Authentication**: (To be implemented)
- **Forms**: React Hook Form with Zod validation

## 📝 Notes

- The database connection is configured to use SSL with `rejectUnauthorized: false` for Neon compatibility
- Environment variables are used for database configuration
- Database schema includes tables for users, courses, videos, and categories
- All dummy/mock data has been removed and replaced with proper empty states
- Admin credentials should be set via environment variables in production:
  - `ADMIN_PASSWORD` for default admin user
  - `SUPER_ADMIN_PASSWORD` for super admin user
- TODO: Implement actual API endpoints for courses, videos, and user enrollments
