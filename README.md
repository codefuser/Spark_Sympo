run  

# SPARKTRON 2K26 — Full-Stack College Symposium Platform

SPARKTRON 2K26 is a production-ready, full-stack digital platform built for the National Level Technical Symposium organized by the Department of Electronics and Communication Engineering (ECE).

---

## Technical Stack & Architecture

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide Icons
- **Backend**: Next.js Route Handlers (RESTful API), TypeScript
- **Database & ORM**: Prisma ORM with SQLite (Out-of-the-box zero setup local DB, switchable to PostgreSQL)
- **Validation**: Zod Schemas
- **Forms**: React Hook Form with `@hookform/resolvers/zod`
- **Authentication**: HTTP-Only Cookie with JWT (`jose`) for Admin Portal
- **Security**: Server-side score validation, server-side duplicate registration checks

---

## 5 Junior Developer Module Allocation Guide

This repository has been architected to allow 5 junior developers to work simultaneously using AI coding agents without merge conflicts:

| Developer             | Scope                                          | Key Directory Paths                                                                                                             |
| :-------------------- | :--------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------ |
| **Developer 1** | Home Page & Hero System                        | `app/page.tsx`, `components/home/*`, `components/layout/*`                                                                |
| **Developer 2** | About Page & Symposium Hub                     | `app/about/page.tsx`, `app/symposium/page.tsx`                                                                              |
| **Developer 3** | Events Catalog & Dynamic Details               | `app/events/page.tsx`, `app/events/[slug]/page.tsx`                                                                         |
| **Developer 4** | Registration Engine, Quiz & Leaderboard        | `app/register/page.tsx`, `app/quiz/page.tsx`, `app/results/page.tsx`, `app/leaderboard/page.tsx`                        |
| **Developer 5** | Admin Portal, Coordinators, Sponsors & Contact | `app/admin/page.tsx`, `app/coordinators/page.tsx`, `app/sponsors/page.tsx`, `app/contact/page.tsx`, `app/api/admin/*` |

---

## Getting Started

### 1. Prerequisites

- Node.js 18+ or 20+
- npm 9+

### 2. Environment Setup

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Database Initialization & Seeding

Run Prisma migrations and seed the database with mock events, quiz questions, coordinators, and default admin credentials:

```bash
npx prisma db push
node prisma/seed.js
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Admin Portal Access

- **URL**: `http://localhost:3000/admin/login`
- **Email**: `admin@sparktron.ece`
- **Password**: `sparktron2k26#admin`

---

## Production Build & Verification

To test a full production build locally:

```bash
npm run build
npm run start
```

---

## Git Workflow & Branch Strategy

- `main`: Production ready code
- `develop`: Integration branch
- `feature/home`: Developer 1 branch
- `feature/about`: Developer 2 branch
- `feature/events`: Developer 3 branch
- `feature/registration`: Developer 4 branch
- `feature/admin`: Developer 5 branch
