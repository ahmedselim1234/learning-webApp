# EduPlatform — Learning Management System

A full-featured edtech single-page application built as a portfolio project. Covers the complete learner journey from course discovery through enrollment, lesson playback, progress tracking, and certificate generation.

## Tech Stack

| Layer | Library / Tool |
|---|---|
| UI | React 18 + TypeScript |
| Styling | Tailwind CSS v3 (dark mode via `class`) |
| Routing | React Router v6 |
| State | Redux Toolkit + RTK Query |
| Charts | Recharts |
| Drag & Drop | react-beautiful-dnd |
| PDF / Certificates | html2canvas + jsPDF |
| Build | Vite 6 |

**Color theme:** Indigo / Purple — primary `indigo-600` (#4f46e5), accent `purple-500` (#a855f7).

## Project Structure

```
src/
├── components/
│   ├── layout/        # Navbar, Footer
│   ├── course/        # CourseCard
│   └── ui/            # Button, Card, Badge, Avatar, Modal,
│                      # Toast, Breadcrumb, Skeleton
├── pages/
│   ├── Home/
│   ├── Courses/       # Course catalog
│   ├── CourseDetails/ # Course overview, ratings, enroll
│   ├── Learn/         # Lesson player
│   ├── Dashboard/     # Learner progress & stats
│   ├── Instructor/    # Instructor analytics
│   ├── Auth/          # Login & Register
│   └── NotFound/
├── store/
│   ├── services/      # RTK Query + mockBaseQuery
│   └── slices/        # auth, enrollments, wishlist, theme
└── types/             # Shared TypeScript interfaces
```

## Architecture Notes

- **RTK Query mock layer** — `src/store/services/mockBaseQuery.ts` intercepts all API calls, imports local JSON fixtures, and adds a 300 ms simulated delay so the UI behaves like a real async app without a backend.
- **localStorage persistence** — the `auth`, `enrollments`, `wishlist`, and `theme` Redux slices persist their state across page reloads.
- **ThemeInitializer** — a component in `App.tsx` keeps the Redux theme state in sync with `document.documentElement.classList` so Tailwind's dark-mode utilities work correctly.

## Phases

| # | Phase | Status |
|---|---|---|
| 1 | Foundation — scaffolding, mock data, shared UI, routing | ✅ Complete |
| 2 | Auth — login/register flows, protected routes, onboarding | Pending |
| 3 | Course catalog — search, filter, pagination | Pending |
| 4 | Course details — curriculum, ratings, enroll | Pending |
| 5 | Lesson player — video, progress tracking | Pending |
| 6 | Dashboard — learner stats, activity feed | Pending |
| 7 | Instructor — course management, analytics | Pending |
| 8 | Certificates — PDF generation, sharing | Pending |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

```bash
npm run build   # production build (runs tsc -b then vite build)
npm run preview # preview the production build locally
```

## Bugs Fixed

### Unused variable causing TypeScript strict-mode error (`fix error`)

**File:** `src/pages/CourseDetails/index.tsx` — `RatingBar` component

**Problem:** A `counts` variable was declared but never used inside `RatingBar`. TypeScript's `noUnusedLocals` flag (enabled in strict mode) treats this as a compile error, which blocks `tsc -b` and therefore the production build.

```ts
// before — unused variable
function RatingBar({ stars, total }: { stars: number; total: number }) {
  const counts = [5, 4, 3, 2, 1].map(s => ({ ... }))  // ← never read
  ...
}
```

**Fix:** Removed the `counts` declaration entirely.

---

### Unused destructured parameters blocking deploy build (`fix error for deploy`)

**File:** `src/pages/CourseDetails/index.tsx` — `RatingBar` component

**Problem:** After the first fix, the destructured props `{ stars, total }` were still declared in the function signature but not used in the JSX body. This again triggers `noUnusedParameters` in strict TypeScript and fails `tsc -b` during `npm run build`.

```ts
// before — unused parameters
function RatingBar({ stars, total }: { stars: number; total: number }) { ... }
```

**Fix:** Renamed the parameter to `_` (the conventional TypeScript/JavaScript idiom for an intentionally ignored parameter) so the compiler no longer flags it.

```ts
// after
function RatingBar(_: { stars: number; total: number }) { ... }
```
