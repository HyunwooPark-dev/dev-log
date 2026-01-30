# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DevLog - 짧은 공부 로그 + 대시보드 + AI 글쓰기 보조 서비스

A learning log service built with Next.js 15 (App Router), featuring:
- Personal learning log management
- Dashboard with statistics and streaks
- Community features (public logs, rankings, trending tags)
- AI-powered article generation from TIL logs (GPT-4o-mini)
- Semantic search using embeddings (text-embedding-3-small + pgvector)

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **State Management**: React Query (server state) + Zustand (client state)
- **Database**: PostgreSQL (Supabase) with Prisma ORM
- **Vector Search**: pgvector extension
- **Authentication**: NextAuth.js v5
- **AI**: OpenAI API (GPT-4o-mini, text-embedding-3-small)

## Development Setup

1. Copy `.env.example` to `.env` and fill in the values
2. Run `npm install`
3. Set up Supabase project and enable pgvector extension
4. Run `npx prisma db push` to sync database schema
5. Run `npm run dev` to start development server

## Build Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open Prisma Studio to view database
- `npx prisma db push` - Push schema changes to database
- `npx prisma generate` - Generate Prisma Client

## Project Structure

```
app/                    # Next.js App Router pages
├── api/               # API Route Handlers
│   ├── logs/          # Log CRUD endpoints
│   ├── stats/         # Statistics endpoints
│   ├── community/     # Community endpoints
│   └── ai/            # AI endpoints (generate, search, embed)
├── dashboard/         # Dashboard page
├── logs/              # Logs list and detail pages
├── community/         # Community feed page
├── search/            # AI search page
└── settings/          # Settings page

components/
├── ui/                # shadcn/ui components
├── layout/            # Header, navigation
├── dashboard/         # Dashboard widgets
├── logs/              # Log-related components
├── community/         # Community components
└── search/            # Search components

lib/
├── prisma.ts          # Prisma client
├── supabase.ts        # Supabase client + vector search
├── openai.ts          # OpenAI client (embeddings, article generation)
├── auth.ts            # NextAuth configuration
└── utils.ts           # Utility functions

hooks/                 # React Query hooks
stores/                # Zustand stores
types/                 # TypeScript type definitions
prisma/                # Prisma schema
```

## Key Patterns

- Server Components by default, "use client" only when necessary
- React Query for all server state (logs, stats, community data)
- Zustand for UI state (filters, modals, view preferences)
- API routes handle auth checks and return appropriate errors
- Embeddings are generated async when logs are created
