# Dreamy Software Todo App

A modern, full-stack todo application built with Next.js, featuring user authentication, task management, and a responsive UI.

## Overview

This application allows users to create, manage, and organize their todos with features like drag-and-drop reordering, user authentication, and profile management. It utilizes Next.js for the frontend and backend API routes, with state management powered by Redux Toolkit and TanStack React Query.

## Features

- **User Authentication**: Secure login and signup pages with NextAuth.js integration
- **Dashboard**: Central hub for accessing todos and user information
- **Profile Management**: Update user profile details
- **Todo Management**: Create, read, update, and delete todos
- **Drag and Drop**: Reorder tasks using @dnd-kit for an intuitive experience
- **Responsive Design**: Built with Tailwind CSS for mobile-first design
- **Form Validation**: Robust validation using Zod and React Hook Form
- **State Management**: Efficient state handling with Redux Toolkit and React Query

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS 4, Lucide React for icons
- **State Management**: Redux Toolkit, TanStack React Query
- **Authentication**: NextAuth.js
- **Forms**: React Hook Form with Zod validation
- **Drag & Drop**: @dnd-kit
- **Linting**: ESLint

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
   Create a `.env.local` file in the root directory and configure necessary environment variables (e.g., for NextAuth, database connections if used).

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:4050](http://localhost:4050) in your browser.

## Usage

- **Registration/Login**: Create an account or log in to access the application.
- **Dashboard**: View your todos and quick access to profile.
- **Todos**: Add new tasks, edit existing ones, mark as complete, and reorder via drag and drop.
- **Profile**: Update your personal information.

## Project Structure

```
todos-app/
├── app/                           # Next.js app directory
│   ├── (auth)/                    # Auth pages (login, signup)
│   ├── (protected)/               # Protected routes (dashboard, profile, todos)
│   ├── api/                       # API routes (auth, users)
│   └── globals.css                # Global styles
├── components/                    # Reusable React components
│   ├── Layout/                    # Layout components (Header, SideBar)
│   └── Providers.tsx              # Context and provider setup
├── lib/                           # Utility libraries and configurations
├── modules/                       # Page-specific modules
├── public/                        # Static assets (icons, images)
└── utils/                         # Utility functions
```

## Build and Deploy

To build the application for production:

```bash
npm run build
npm run start
```

The application is designed to be deployed on Vercel, which integrates seamlessly with Next.js projects.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is private and not licensed for public use.
