# Job Tracker Frontend

Frontend for a job tracking application.

The project allows users to manage their job applications, track their status, add notes, create reminders, and manage their account.

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
│ ├── generated/ # Generated OpenAPI client
│ ├── auth.ts # Authentication API
│ ├── jobs.ts # Jobs API
│ ├── notes.ts # Notes API
│ ├── reminders.ts # Reminders API
│ ├── users.ts # Users API
│ └── http.ts # Axios instance and interceptors
│
├── components/
│ ├── account/ # Account management
│ ├── auth/ # Authentication UI
│ ├── home/ # Home page components
│ ├── jobs/ # Job management UI
│ ├── layout/ # Application layout
│ ├── notes/ # Notes UI
│ ├── reminders/ # Reminder UI
│ └── ui/ # Reusable UI components
│
├── hooks/ # React hooks
├── layouts/ # Application layouts
├── lib/ # Utilities and authentication storage
├── pages/ # Application pages
├── providers/ # Context and React Query providers
├── routes/ # Route protection
├── types/ # TypeScript types
├── assets/ # Static assets
├── App.tsx #
├── index.css # Style
└── main.tsx #
