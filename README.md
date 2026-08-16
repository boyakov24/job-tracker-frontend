# Job Tracker Frontend

Frontend for a job tracking application.

The project allows users to manage their job applications, track their status, add notes, create reminders, and manage their account.

## Live Demo

https://job-tracker-frontend-uggq.onrender.com

## Features

- User registration and login
- JWT authentication
- Protected dashboard route
- Automatic logout when authentication becomes invalid
- Job management:
  - Create jobs
  - Edit jobs
  - Delete jobs
  - Track application status
  - Store application URLs
- Pagination
- Filtering by job status
- Sorting jobs
- Notes for job applications
- Reminders for notes
- Account management:
  - Change email
  - Change password
  - Delete account
- Form validation with backend validation errors
- Password visibility toggle
- Light and dark themes
- Interactive demo board on the home page
- Responsive interface

## Tech Stack

- React
- TypeScript
- Vite
- React Router
- Axios
- TanStack Query
- Tailwind CSS
- shadcn/ui
- Lucide React
- OpenAPI generated client

## Project Structure

src/
├── api/
│ ├── generated/
│ ├── auth.ts
│ ├── jobs.ts
│ ├── notes.ts
│ ├── reminders.ts
│ ├── users.ts
│ └── http.ts
│
├── components/
│ ├── auth/
│ ├── account/
│ ├── home/
│ ├── jobs/
│ ├── layout/
│ ├── notes/
│ ├── reminders/
│ └── ui/
│
├── hooks/
├── layouts/
├── lib/
├── pages/
├── providers/
├── routes/
├── types/
├── App.tsx
├── index.css
└── main.tsx

## Installation

### Clone the repository

```bash
git clone https://github.com/boyakov24/job-tracker-frontend.git
cd job-tracker-frontend
```

### Install dependencies

```bash
npm install
```

### Configure environment variables

Create a `.env` file in the project root and fill in the required environment variables.

```env
VITE_API_URL=http://localhost:3000
```

### Available Scripts

Development:

```bash
npm run dev
```

Production build:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

OpenAPI client generation:

```bash
npm run openapi
```

## Authentication

Authentication is handled using JWT.

The frontend:

- Stores the authentication token locally
- Sends the token with authenticated API requests
- Protects the /dashboard route
- Redirects unauthenticated users away from protected pages
- Logs the user out when the authentication session becomes invalid

## API

The frontend communicates with the Job Tracker backend API.

Production API:
https://job-tracker-api-g0bn.onrender.com

Swagger:
https://job-tracker-api-g0bn.onrender.com/api

The backend is built with:

- NestJS
- Drizzle ORM
- PostgreSQL
- Neon Database
- JWT
- Swagger

The frontend API is located in:

src/api/

## Deployment

The frontend is intended to be deployed as a Vite static application on Render.

Build command:

```bash
npm run build
```

Publish directory:

dist

Production environment variable:

VITE_API_URL=https://job-tracker-api-g0bn.onrender.com

## Related Project

This frontend is part of the Job Tracker project and works together with the Job Tracker backend API.

## License

This project is licensed under the MIT License.
