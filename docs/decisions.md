# Architecture Decision Records

## ADR-001: Monorepo with Separate Frontend/Backend Directories

**Date:** 2026-08-10
**Status:** Accepted

**Context:** We need a project structure that supports independent frontend and backend development while keeping everything in one repository.

**Decision:** Use a flat monorepo with `frontend/` and `backend/` as sibling directories. No monorepo tooling (Nx, Turborepo) for now.

**Rationale:** Simple, easy to understand, no tooling overhead. The frontend and backend have completely independent dependency trees (npm vs. pip), so workspace-level dependency management adds no value at this scale.

---

## ADR-002: Vite + React + TypeScript

**Date:** 2026-08-10
**Status:** Accepted

**Context:** Need a frontend framework and build tool for a SaaS-style data management UI.

**Decision:** React 19 with TypeScript, built with Vite.

**Rationale:** React has the largest ecosystem for data-heavy UIs. TypeScript catches interface contract bugs between the frontend and backend API. Vite provides fast HMR and build times.

---

## ADR-003: Tailwind CSS v4 (CSS-First Configuration)

**Date:** 2026-08-10
**Status:** Accepted

**Context:** Need a styling approach that supports rapid UI development with dark/light theming.

**Decision:** Tailwind CSS v4 with CSS-native configuration (no `tailwind.config.ts`). Theme tokens defined as CSS custom properties.

**Rationale:** v4's CSS-first approach eliminates config file complexity. Custom properties enable runtime theme switching without class swapping.

---

## ADR-004: Mock Data Layer with API Client Stub

**Date:** 2026-08-10
**Status:** Accepted

**Context:** The backend doesn't exist yet, but pages need data to render and interactions to work.

**Decision:** All data access goes through `lib/api.ts`, which currently returns data from `lib/mockData.ts`. The mock store is mutable (in-memory) so create/update flows work during development.

**Rationale:** When the FastAPI backend is ready, only `api.ts` needs modification. Page components never import mock data directly, ensuring a clean swap.

---

## ADR-005: Dataset Upload Separation

**Date:** 2026-08-10
**Status:** Accepted

**Context:** Dataset upload will eventually involve real file processing, but we need the UI now.

**Decision:** Upload logic is isolated in `lib/api.ts` (`uploadDatasetFiles` function) and the `DatasetUploadPage`. The upload simulates progress with `setTimeout`. No files are actually processed or stored.

**Rationale:** Clean boundary for replacing with real `FormData` + `fetch` to a FastAPI `/upload` endpoint later, without touching the page component's UI logic.

---

## ADR-006: No External Component Library

**Date:** 2026-08-10
**Status:** Accepted

**Context:** Need UI components (buttons, cards, modals, tables) but want to control the design.

**Decision:** Build a small set of reusable components in `components/ui/` using Tailwind classes directly. No dependency on Radix, shadcn/ui, MUI, or similar.

**Rationale:** Keeps the dependency tree small, avoids version lock-in, and gives full control over the design system. The component set is small enough (~10 components) that the maintenance cost is minimal.
