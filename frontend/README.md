# EngageOS Frontend

Production-grade CRM dashboard built with React 18, Vite, TypeScript, and Tailwind CSS.

## Prerequisites

- Node.js 18+
- EngageOS backend running on `http://localhost:5000`

## Installation

```bash
cd frontend
npm install
```

## Environment

Copy the example env file and adjust if needed:

```bash
cp .env.example .env
```

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | `http://localhost:5000` | Backend API base URL |

## Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Production Build

```bash
npm run build
npm run preview
```

## Tech Stack

- React 18 + Vite + TypeScript
- React Router DOM
- TanStack Query
- Axios
- React Hook Form + Zod
- Tailwind CSS + shadcn/ui
- Recharts
- Lucide React

## Pages

| Route | Page |
|-------|------|
| `/login` | Sign in |
| `/register` | Create account |
| `/verify-otp` | Email verification |
| `/forgot-password` | Request reset code |
| `/reset-password` | Set new password |
| `/dashboard` | Overview & analytics |
| `/customers` | Customer management |
| `/audience` | Audience builder |
| `/campaigns` | Campaign management |
| `/ai-studio` | AI campaign agent |
| `/ai-analytics` | AI analytics chat |
| `/settings` | Account settings |

## Project Structure

```
src/
├── api/           # API service layer
├── components/    # UI, layout, and feature components
├── contexts/      # React contexts (auth)
├── hooks/         # Custom hooks
├── lib/           # Axios client and utilities
├── pages/         # Route pages
└── types/         # TypeScript interfaces
```