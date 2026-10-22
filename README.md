# Football Players

A football player management application built with React, Vite, Tailwind CSS, and Supabase.

## Overview

Football Players is a web application designed to organize and manage football player information through a clean, football-inspired interface.

The project includes player management views, player details, reusable UI components, and a responsive layout.

## Features

- **Player management:** Create, view, edit, and delete player records.
- **Player details:** Display player information, including profile data and additional details when available.
- **Responsive layout:** Adapt the interface to different screen sizes.
- **Navigation:** Navigate between the home page, players, teams, and matches sections.
- **Theme switching:** Change the application's visual theme.
- **404 page:** Display a custom page when a route cannot be found.
- **Supabase integration:** Use Supabase as the backend data service.

> Teams and matches sections may require further implementation depending on the current project status.

## Tech Stack

- **React** — UI development.
- **Vite** — Development server and build tool.
- **React Router** — Client-side routing.
- **Tailwind CSS** — Utility-first styling.
- **Supabase** — Backend and database services.
- **ESLint** — Code linting.
- **pnpm** — Package management.

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- pnpm
- A Supabase project

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:

   ```bash
   cd hero-supabase
   ```

3. Install dependencies:

   ```bash
   pnpm install
   ```

4. Configure the environment variables as described below.

5. Start the development server:

   ```bash
   pnpm run dev
   ```

Vite will display the local URL where you can access the application.

## Environment Variables

Create a `.env` file in the project root and configure the variables required by your Supabase client.

For example, if your client uses Vite environment variables:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_publishable_key
```

Use the exact variable names expected by your Supabase configuration in `src/utils/supabase.js`.

**Security:** Never commit `.env` or expose your Supabase secret or service-role key in frontend code. Only use the public client key intended for browser applications, together with appropriate Row Level Security (RLS) policies.

## Available Scripts

| Command | Description |
|---|---|
| `pnpm run dev` | Start the development server. |
| `pnpm run build` | Build the application for production. |
| `pnpm run preview` | Preview the production build locally. |
| `pnpm run lint` | Run ESLint checks. |

## Project Structure

```text
src/
├── assets/           # Static assets
├── components/       # Reusable UI components
├── layouts/          # Shared application layouts
├── pages/            # Application pages
├── styles/           # Global and shared styles
├── utils/            # Supabase client and helper functions
├── App.jsx           # Application routes
├── index.css         # Global styles
└── main.jsx          # Application entry point
```

## Development

Run the linter and production build to check the project before submitting changes:

```bash
pnpm run lint
pnpm run build
```

## Contributing

1. Create a feature branch from `main`.
2. Implement your changes.
3. Run the available checks.
4. Commit using clear, semantic commit messages.
5. Open a pull request describing the changes.

Example branch name:

```text
feat/player-search
```

Example commit message:

```text
feat: add player search
```