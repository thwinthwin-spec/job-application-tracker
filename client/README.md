# Job Application Tracker — Client

The React + Vite front end for the Job Application Tracker. It talks to the Express API in the
sibling `server/` folder. All data is demo data; please do not enter real personal information.

## Requirements

- Node.js 18 or newer
- npm
- The API server running on `http://localhost:5001/api` (see `../server`)

## Setup

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

The `.env` file is optional. If it is missing, the app uses `http://localhost:5001/api`.
Only `.env.example` is included in this project — never commit a real `.env` file.

| Variable | Description | Default |
| --- | --- | --- |
| `VITE_API_URL` | Base URL of the API, including `/api` | `http://localhost:5001/api` |

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the dev server on port **5174** (does not open a browser) |
| `npm run build` | Builds the production site into `dist/` |
| `npm run preview` | Serves the production build locally on port **5174** |

## Demo accounts

The login and registration pages include one-click shortcuts for these seeded users:

| Email | Password |
| --- | --- |
| `demo@jobtracker.test` | `Demo@123` |
| `other@jobtracker.test` | `Other@123` |

## What is inside

- `src/api/` — small axios wrappers for auth and application endpoints
- `src/context/` — authentication state shared by the whole app
- `src/components/` — reusable UI pieces (badges, table, filters, dialog, and so on)
- `src/pages/` — one file per route
- `src/utils/` — constants and date/text formatting helpers

## Session handling

A successful login stores a token in `localStorage` under `token` and the user under `user`.
Logging out removes both. Any `401` response from the API clears the session and returns the
visitor to `/login`.

## Available routes

| Route | Access | Purpose |
| --- | --- | --- |
| `/login` | public | Sign in |
| `/register` | public | Create an account |
| `/dashboard` | protected | Totals, status counts and upcoming items |
| `/applications` | protected | Search, filter, sort, paginate and export |
| `/applications/new` | protected | Add an application |
| `/applications/:id` | protected | Application details and delete |
| `/applications/:id/edit` | protected | Edit an application |

The code intentionally uses plain `useState` / `useEffect`, small named functions and plain CSS
so it is easy to follow for someone still learning React.
