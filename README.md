# SmartBell SaaS

Realtime School Bell & Public Address Management System.

## Stack

| Layer | Tech |
|---|---|
| Backend | Node.js, Express 4, Prisma 5, PostgreSQL (Neon) |
| Realtime | Socket.IO 4 |
| Scheduling | node-cron |
| Auth | JWT (access 15m + refresh 7d), bcryptjs |
| TTS | ElevenLabs (primary) + Google Cloud TTS (fallback) |
| Storage | Cloudinary |
| Frontend | React 18, Vite 5, TailwindCSS 3 |
| State | Zustand + TanStack Query v5 |
| Package Mgr | pnpm (workspace) |

## Quick Start

### 1. Clone & install

```bash
git clone <repo>
pnpm install        # installs all workspace packages
```

### 2. Configure backend

```bash
cp backend/.env.example backend/.env
# fill in your DATABASE_URL, JWT_SECRET, CLOUDINARY_*, ELEVENLABS_API_KEY, etc.
```

### 3. Set up database

```bash
cd backend
pnpm prisma migrate dev --name init
pnpm prisma db seed
```

Seed creates:
- SuperAdmin: `superadmin@smartbell.io` / `SuperAdmin@123`
- School Admin: `admin@demoacademy.com` / `SchoolAdmin@123`
- 6 default bell schedules for Demo Academy

### 4. Run dev servers

```bash
# Terminal 1 — backend (port 5000)
cd backend && pnpm dev

# Terminal 2 — frontend (port 5173)
cd frontend && pnpm dev
```

### 5. Open browser

```
http://localhost:5173
```

## Project Structure

```
school-bell/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   ├── src/
│   │   ├── config/          # db, cloudinary, env validation
│   │   ├── middlewares/     # auth, rbac, validate, upload, errorHandler
│   │   ├── modules/         # auth, schools, users, devices, announcements,
│   │   │                    # schedules, analytics, subscriptions
│   │   ├── services/        # socket, scheduler (cron), tts
│   │   └── utils/           # logger, apiResponse, crypto, activityLogger
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Sidebar, Navbar, NotificationPanel, ui/
│   │   ├── hooks/           # useAuth, useSocket
│   │   ├── layouts/         # MainLayout, AuthLayout
│   │   ├── pages/           # Landing, Login, Register, Dashboard, ...
│   │   ├── services/        # api.js (axios), socket.js (socket.io-client)
│   │   └── store/           # authStore, socketStore (Zustand)
│   └── package.json
├── pnpm-workspace.yaml
└── .gitignore
```

## Environment Variables

See `backend/.env.example` for the full list. Required keys:

```
DATABASE_URL=
JWT_SECRET=
JWT_REFRESH_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
ELEVENLABS_API_KEY=
```

## Subscription Plans

| Plan | Devices | Price |
|---|---|---|
| Starter | 5 | Free |
| Professional | 25 | $49/mo |
| Enterprise | Unlimited | $149/mo |
