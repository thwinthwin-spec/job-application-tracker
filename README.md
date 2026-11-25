# Job Application Tracker

The Job Application Tracker is a full-stack app for recording, searching and managing the jobs you have applied to. Instead of digging through many Excel files, you can see application status, follow-up dates and interview dates clearly in one place.

The project has two main parts:

- **server/** — Express API + MongoDB (where data is stored)
- **client/** — React/Vite website (what the user sees)

## At a glance — what is this project?

| | |
| --- | --- |
| **Project** | Job Application Tracker |
| **Type** | Full-stack web app — a personal organizer for job applications |
| **What it does** | Record jobs by status / follow-up / interview, search + filter + sort, dashboard, CSV export |
| **Tech** | React + Vite · Node.js + Express · MongoDB + Mongoose · JWT + bcrypt |
| **Ports** | API `5001` · Website `5174` |
| **Demo login** | `demo@jobtracker.test / Demo@123` (12 sample records), `other@jobtracker.test / Other@123` (separate user) |
| **Status** | Completed demo project. All data is **fictional**. |

In short: A full-stack personal tracker for job applications. Log companies, roles, statuses, follow-up and interview dates; search and filter them; see dashboard stats; export to CSV. Each signed-in user only sees their own data. Built with React, Express and MongoDB as a learning/demo project with fictional data.

## Purpose

This app helps a job seeker do the following easily:

- Record the company, role, location and posting URL of each application
- Track status with `Saved`, `Applied`, `Interview`, `Offer`, `Rejected`, `Withdrawn`
- Keep track of follow-up and interview dates
- Find things quickly with search, status filter, employment-type filter and date-range filter
- View large data sets neatly with sorting and pagination
- See totals, counts by status and upcoming items on the dashboard
- Export data to a spreadsheet with CSV export
- Make sure a signed-in user only sees their own data

> **Note:** All sample data in this project is **fictional**. It does not represent real people or companies.

## Tech stack

| Layer | Used | Purpose |
| --- | --- | --- |
| API | Node.js, Express | Receives HTTP requests and returns responses |
| Database | MongoDB, Mongoose | Stores application and user data |
| Auth | JWT, bcrypt | Token-based login and hashed passwords |
| Website | React, Vite | Builds pages, forms and tables |
| HTTP client | Axios | Used by the client to call the API |
| State | React Context API | Shares the signed-in user between pages |
| Styling | CSS (`index.css`) | Simple, readable UI |
| Tools | npm, PowerShell (`make-zip.ps1`) | Install / run / zip |

## Folder summary

| Location | Summary |
| --- | --- |
| `.gitignore` | Excludes `node_modules`, build output and secret files from git |
| `package.json` | Root scripts (`install:all`, `seed`, `dev:server`, `dev:client`, `build:client`) |
| `make-zip.ps1` | PowerShell script that creates a zip of the project |
| `README.md` | This document — a short install/run guide |
| `API_DOCUMENTATION.md` | Endpoints, request/response shapes and curl examples |
| `PROJECT_STRUCTURE.md` | Complete file tree with the purpose of every file |
| `BEGINNER_GUIDE.md` | Explains how a "create application" request flows through the code |
| `server/` | API, config, models, controllers, routes, middleware, utils, seed |
| `client/` | React pages, components, api helpers, auth context, utils |

See the full tree in [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md).

## Prerequisites

Before you start, make sure you have:

1. **Node.js 18+** and **npm** — check with `node -v` and `npm -v`
2. **MongoDB** running at `mongodb://127.0.0.1:27017/job_tracker`
3. **PowerShell** — needed by `make-zip.ps1` if you want to create a zip
4. A code editor (for example VS Code)

**Ports:** The API uses `5001` and the website uses `5174`. These were chosen to avoid conflicts with other projects.

## Installation

Open a terminal in the project root (where `job-application-tracker` lives):

```powershell
npm run install:all
```

This installs dependencies for both `server` and `client`. To install them separately, use `npm install --prefix server` and `npm install --prefix client`.

## Environment setup

### API (based on `server/.env.example`)

`server/.env.example` lists the required keys. Set these values:

| Variable | Value / purpose |
| --- | --- |
| `PORT` | `5001` — port the API listens on |
| `MONGODB_URI` | `mongodb://127.0.0.1:27017/job_tracker` |
| `JWT_SECRET` | Private secret string — change it in a real project |
| `JWT_EXPIRES_IN` | `7d` — token expires after 7 days |
| `CLIENT_ORIGIN` | `http://localhost:5174` — allows requests from React |
| `SEED_USER_EMAIL` | `demo@jobtracker.test` |
| `SEED_USER_PASSWORD` | `Demo@123` |
| `SEED_OTHER_EMAIL` | `other@jobtracker.test` |
| `SEED_OTHER_PASSWORD` | `Other@123` |

### Website (based on `client/.env.example`)

| Variable | Value |
| --- | --- |
| `VITE_API_URL` | `http://localhost:5001/api` |

> Do not commit secrets. `.gitignore` protects you, but when sharing, share the `.env.example` form only.

## Seeding

```powershell
npm run seed
```

The seed is **idempotent** — running it twice does not create duplicate data. It creates:

| Account | Number of applications |
| --- | --- |
| `demo@jobtracker.test` / `Demo@123` | 12 (fictional) |
| `other@jobtracker.test` / `Other@123` | 2 (fictional) |

## Running

Open **two** terminals from the project root.

**Terminal 1 — API**

```powershell
npm run dev:server
```

**Terminal 2 — Website**

```powershell
npm run dev:client
```

Then open:

- Website: `http://localhost:5174`
- API base: `http://localhost:5001/api`

To build the website for production:

```powershell
npm run build:client
```

## Demo credentials

| Email | Password | Notes |
| --- | --- | --- |
| `demo@jobtracker.test` | `Demo@123` | 12 sample applications |
| `other@jobtracker.test` | `Other@123` | 2 sample applications — a separate user |

Sign in with both accounts to verify that one user's data is not visible to the other.

## Sample-data privacy note

- All sample companies, names, emails, URLs and notes are **fictional**. They do not represent real people or companies.
- Use demo accounts for testing only. For real use, change the passwords and `JWT_SECRET`.
- Do not put personal information into the demo data.

## Quick smoke test

1. Make sure MongoDB is running and the environment values are filled in.
2. Run `npm run install:all`, then `npm run seed`.
3. Start `npm run dev:server` and `npm run dev:client` in two terminals.
4. Sign in at the website with `demo@jobtracker.test` / `Demo@123`.
5. You should see stats on the dashboard. Create, edit, search and export an application.
6. Sign in as `other@jobtracker.test` and confirm the first account's applications are not visible.

## Troubleshooting

| Problem | Likely cause | Fix |
| --- | --- | --- |
| `ECONNREFUSED 127.0.0.1:27017` | MongoDB is not running | Start the MongoDB service and check `MONGODB_URI` |
| API port `5001` unavailable | Another process is using it | Change your port and update `CLIENT_ORIGIN` and `VITE_API_URL` |
| Website port `5174` unavailable | Conflict with another project | Give Vite another port and update the API's `CLIENT_ORIGIN` |
| Login returns `401` | Wrong password or expired token | Check the demo credentials, then log out and sign in again |
| CORS error | `CLIENT_ORIGIN` does not match the website URL | Check that it is `http://localhost:5174` |
| Seed reports duplicate email | Seed was already run | The seed is idempotent, so it is safe to continue; if there is an error, check the env emails |
| `npm` command not found | Node.js is not installed | Install Node.js 18+ and open a new terminal |
| CSV download fails | Token missing or export request did not arrive | Sign in again and test with the curl example in [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) |

## Creating a zip

From the project root in PowerShell:

```powershell
./make-zip.ps1
```

`make-zip.ps1` puts the source files into a zip. It excludes `node_modules`, `dist`, `build`, `.git`, `.env` and `.log` files, so the zip stays small and contains no secrets.

## Further reading

- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) — endpoint details, response shapes, status codes, curl examples
- [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) — complete file tree and data-flow diagram
- [BEGINNER_GUIDE.md](./BEGINNER_GUIDE.md) — how a request flows and where to start reading
