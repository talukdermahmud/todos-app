# Dreamy Software Todo App

A modern, full-stack todo application built with Next.js, featuring user authentication, task management, dashboard analytics, and a responsive UI.

## Overview

This application allows users to create, manage, and organize their todos with features like search, filtering by due dates, priority management, and dashboard analytics. It utilizes Next.js for both the frontend and backend API routes, with state management powered by Redux Toolkit and TanStack React Query.

## Features

- **User Authentication**: Secure login and signup pages with NextAuth.js integration
- **Dashboard**: Central hub with analytics showing total tasks and priority breakdowns via pie chart
- **Profile Management**: Update user profile details
- **Password Change**: Change password functionality in protected routes
- **Todo Management**: Create, edit, update, and delete todos with priorities (low, moderate, extreme)
- **Drag and Drop**: Reorder tasks using @dnd-kit for an intuitive experience
- **Search and Filters**: Search tasks by title and filter by deadline (today, 5 days, 10 days, 30 days)
- **Form Validation**: Robust client-side validation using Zod and React Hook Form
- **Responsive Design**: Built with Tailwind CSS for mobile-first design
- **State Management**: Efficient state handling with Redux Toolkit and React Query
- **Loading States**: Smooth user experience with loading indicators and toast notifications

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS 4, Lucide React for icons, Tailwind CSS Animate
- **State Management**: Redux Toolkit, TanStack React Query
- **Authentication**: NextAuth.js
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts for dashboard visualization
- **Linting**: ESLint with Next.js config

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/talukdermahmud/todos-app.git
   cd todos-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and configure necessary environment variables for NextAuth and any database connections if applicable.

4. Run the development server:

   ```bash
   npm run dev --turbo -p 4050
   ```

5. Open [http://localhost:4050](http://localhost:4050) in your browser.

## Usage

- **Registration/Login**: Create an account or log in to access the application.
- **Dashboard**: View task statistics and priority distribution in a pie chart.
- **Todos**: Add new tasks with title, description, priority, and due date; search and filter tasks; edit or delete existing tasks.
- **Profile**: Update your personal information.
- **Password Change**: Securely change your account password.

## Project Structure

```
todos-app/
├── app/                           # Next.js app directory
│   ├── (auth)/                    # Auth pages (login, signup)
│   ├── (protected)/               # Protected routes (dashboard, profile, todos)
│   ├── api/                       # API routes (auth, users)
│   ├── globals.css                # Global styles
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Home page (redirects to login)
│   └── middleware.ts              # Authentication middleware
├── components/                    # Reusable React components
│   ├── Layout/                    # Layout components (Header, SideBar)
│   ├── Loader.tsx                 # Loading component
│   ├── Providers.tsx              # React Query and Redux providers
│   └── Toaster.tsx                # Toast notifications
├── lib/                           # Utility libraries and configurations
│   ├── api.ts                     # RTK Query setup
│   ├── auth.ts                    # NextAuth configuration
│   ├── store.ts                   # Redux store
│   └── schemas.ts                 # Zod schemas
├── modules/                       # Page-specific modules
│   ├── Dashboard/                 # Dashboard module with charts
│   ├── Profile/                   # Profile and password change
│   └── Todo/                      # Todo list management
├── public/                        # Static assets (icons, images)
└── utils/                         # Utility functions
```

## Build and Deploy

To build the application for production:

```bash
npm run build
npm run start
```

The application is designed to be deployed on Vercel or other platforms that support Next.js.
