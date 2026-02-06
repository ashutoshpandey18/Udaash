# Day 15 - Production Database & API Layer

## Overview

This implementation provides a clean, extensible database schema and API layer for UDAASH, transitioning from mock data to real persistence using Prisma ORM and PostgreSQL.

## What Was Built

### Database Schema (`prisma/schema.prisma`)
- **Job Model**: Title, company, location, market, salary range, skills, timestamps
- **User Model**: Email, skills, location, timestamps
- **Application Model**: Status tracking, job/user relations, notes
- **Enums**: Market (INDIA, US, DE), ApplicationStatus (PENDING, APPLIED, REPLIED, INTERVIEW, REJECTED, ACCEPTED)

### API Routes

#### Jobs API (`/api/jobs`)
- `GET /api/jobs` - List jobs with filtering by market and skills
- `POST /api/jobs` - Create job (admin stub for future auth)
- `GET /api/jobs/[id]` - Get single job with applications

#### Applications API (`/api/applications`)
- `POST /api/applications` - Create application with duplicate checking
- `GET /api/applications` - List applications by user or job
- `PATCH /api/applications/[id]` - Update application status

#### Users API (`/api/users`)
- `GET /api/users/[id]` - Get user profile with applications
- `PATCH /api/users/[id]` - Update user profile

### Components
- **SyncStatus** (`components/sync-status.tsx`) - Visual sync indicator (saved/saving/offline/error)
- **useSyncStatus** - Hook for managing sync state in components

### Infrastructure
- **Prisma Client Singleton** (`lib/db.ts`) - HMR-safe database client
- **Seed Script** (`prisma/seed.ts`) - 100 sample jobs across markets
- **Validation** - Zod schemas for all API inputs

## Setup Instructions

### 1. Database Configuration

Add to `.env.local`:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/udaash"
```

For development, use one of:
- **Local PostgreSQL**: Install PostgreSQL locally
- **Vercel Postgres**: https://vercel.com/docs/storage/vercel-postgres
- **Supabase**: https://supabase.com/
- **Railway**: https://railway.app/
- **Neon**: https://neon.tech/ (free tier)

### 2. Generate Prisma Client

```bash
npm run db:generate
```

### 3. Push Schema to Database

```bash
npm run db:push
```

### 4. Seed Sample Data

```bash
npm run db:seed
```

This creates:
- 100 sample jobs (clearly marked as development data)
- 1 sample user
- 5 sample applications

### 5. Start Development Server

```bash
npm run dev
```

### 6. Explore Database (Optional)

```bash
npm run db:studio
```

Opens Prisma Studio at http://localhost:5555

## API Usage Examples

### Fetch Jobs by Market

```typescript
const response = await fetch('/api/jobs?market=INDIA&limit=20');
const { success, data, meta } = await response.json();
```

### Create Application

```typescript
const response = await fetch('/api/applications', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    jobId: 'clx...',
    userId: 'clx...',
    status: 'PENDING',
  }),
});
```

### Update Application Status

```typescript
const response = await fetch('/api/applications/clx...', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    status: 'INTERVIEW',
  }),
});
```

## Using Sync Status Component

```typescript
import { SyncStatus, useSyncStatus } from '@/components/sync-status';

function MyComponent() {
  const { status, setSaving, setSaved, setError } = useSyncStatus();

  const saveData = async () => {
    setSaving('Saving changes...');
    try {
      await fetch('/api/jobs', { /* ... */ });
      setSaved('All changes saved');
    } catch (error) {
      setError('Failed to save');
    }
  };

  return (
    <div>
      <SyncStatus status={status} />
      <button onClick={saveData}>Save</button>
    </div>
  );
}
```

## Security Notes

### Current State (Development)
- No authentication implemented yet
- User IDs accepted in request bodies
- Admin endpoints stubbed with TODOs
- Input validation via Zod
- SQL injection prevented by Prisma

### Future Requirements (Production)
- Implement authentication (NextAuth.js recommended)
- Get userId from session, not request body
- Add role-based authorization for admin endpoints
- Implement rate limiting
- Add API key middleware
- Consider moving sensitive operations to server actions

## Data Integrity

- All seed data clearly marked as "Sample data for development"
- No scraped or copyrighted content
- Cascading deletes configured for foreign keys
- Indexes on frequently queried fields
- Timestamps for audit trails

## Schema Migration Strategy

When schema changes:

```bash
# Development
npm run db:push

# Production (after testing)
npx prisma migrate dev --name descriptive_name
npx prisma migrate deploy
```

## Known Limitations

- No authentication system yet
- No rate limiting implemented
- No background sync workers
- No vector embeddings for AI features
- Seed data is English-only

## Next Steps (Future Days)

1. **Authentication** - NextAuth.js integration
2. **Authorization** - Role-based access control
3. **Real-time Updates** - WebSocket sync
4. **AI Features** - Job matching integration
5. **Analytics** - Usage tracking
6. **Search** - Full-text search with PostgreSQL
7. **Caching** - Redis for performance

## File Structure

```
prisma/
  schema.prisma          - Database schema
  seed.ts                - Sample data seeding

apps/web/src/
  lib/
    db.ts                - Prisma client singleton

  components/
    sync-status.tsx      - Sync indicator component

  app/api/
    jobs/
      route.ts           - Jobs CRUD
      [id]/route.ts      - Single job

    applications/
      route.ts           - Applications CRUD
      [id]/route.ts      - Update application

    users/
      [id]/route.ts      - User profile
```

## Troubleshooting

### Connection Issues
- Verify DATABASE_URL is correct
- Check PostgreSQL is running
- Ensure database exists: `createdb udaash`

### Prisma Client Issues
- Regenerate client: `npm run db:generate`
- Clear cache: `rm -rf node_modules/.prisma`

### Migration Conflicts
- Reset database (dev only): `npx prisma migrate reset`
- Check migration status: `npx prisma migrate status`

## Performance Considerations

- Indexes added on frequently queried fields
- Pagination implemented in list endpoints
- Selective field inclusion via Prisma
- Connection pooling handled by Prisma

## Commit Message

```
[DAY 15] Add production database schema and API layer

- Introduced Prisma schema for jobs, users, and applications
- Added CRUD API routes for core entities
- Seeded realistic sample data for development
- Implemented basic client/server sync handling
- Prepared backend for future auth and AI features
```
