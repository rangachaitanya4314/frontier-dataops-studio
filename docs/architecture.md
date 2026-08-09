# Architecture

## Overview

Frontier DataOps Studio follows a monorepo layout with cleanly separated frontend and backend concerns.

```
frontier-dataops-studio/
├── frontend/       # React SPA (Vite + TypeScript + Tailwind CSS v4)
├── backend/        # FastAPI Python API server (planned)
└── docs/           # Project documentation
```

## Frontend Architecture

### Technology Stack

| Layer       | Technology                    |
|-------------|-------------------------------|
| Framework   | React 19 + TypeScript         |
| Build       | Vite                          |
| Styling     | Tailwind CSS v4               |
| Routing     | React Router v7               |
| Icons       | Lucide React                  |

### Directory Structure

```
frontend/src/
├── components/
│   ├── layout/     # AppShell, Sidebar, TopBar, ThemeToggle
│   └── ui/         # Reusable design-system atoms
├── pages/          # Route-level page components
├── hooks/          # Custom React hooks
├── lib/            # API client, mock data, utilities
├── types/          # Shared TypeScript interfaces
├── App.tsx         # Router configuration
├── main.tsx        # Entry point
└── index.css       # Tailwind directives + theme tokens
```

### Data Flow

```
Pages → lib/api.ts (typed stubs) → lib/mockData.ts (in-memory store)
                                  ↓ (future)
                              FastAPI backend → PostgreSQL
```

The API client (`lib/api.ts`) exposes typed async functions. Today they return mock data. When the backend is ready, only `api.ts` needs to change — no page-level modifications.

### Theming

Dark/light themes are implemented via:
1. CSS custom properties for semantic colors
2. `data-theme` attribute on `<html>`
3. `color-scheme` property for native browser adaptation
4. System preference detection via `prefers-color-scheme`
5. User choice persisted in `localStorage`

### Routing

All routes are nested under an `AppShell` layout that provides the sidebar and top bar. React Router v7 with `<Outlet />` handles the content area.

## Backend Architecture (Planned)

The backend will be a FastAPI Python application providing:
- REST API endpoints matching the frontend's `api.ts` interface
- PostgreSQL database with SQLAlchemy ORM
- File upload handling for datasets
- Background task processing for data validation

The frontend's `api.ts` stub functions will be replaced with real `fetch()` calls targeting the FastAPI server.
