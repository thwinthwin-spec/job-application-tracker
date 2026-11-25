# Job Application Tracker API

A small Express + MongoDB backend for tracking job applications. It uses CommonJS and straightforward Mongoose queries so the code is easy to follow.

## 1. Setup

```powershell
cd server
npm install
Copy-Item .env.example .env
```

Edit `.env` if you need different values. Never commit `.env`; only `.env.example` is tracked.

Environment variables:

| Name | Purpose |
| --- | --- |
| `PORT` | API port, default `5001` |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign tokens |
| `JWT_EXPIRES_IN` | Token lifetime, for example `7d` |
| `CLIENT_ORIGIN` | Allowed CORS origin |
| `SEED_USER_EMAIL` / `SEED_USER_PASSWORD` | Demo account used by `npm run seed` |
| `SEED_OTHER_EMAIL` / `SEED_OTHER_PASSWORD` | Second account used to test ownership |

A development-only fallback secret is used when `JWT_SECRET` is missing. Set a long random secret before deploying.

## 2. Scripts

```powershell
npm run dev      # start with nodemon
npm start        # start normally
npm run seed     # add fictional demo data (safe to repeat)
```

The server listens on `0.0.0.0`. To use a different port for one terminal session:

```powershell
$env:PORT = '5002'
npm start
```

## 3. Response shapes

Success with one item:

```json
{ "success": true, "message": "Application created.", "data": { "application": {} } }
```

Success with a list:

```json
{ "success": true, "data": { "items": [], "page": 1, "pages": 0, "total": 0 } }
```

Error:

```json
{ "success": false, "message": "Validation failed.", "errors": [] }
```

Status codes used: `200`, `201`, `400`, `401`, `403`, `404`, `409`, `500`.

## 4. Auth endpoints

All paths start with `/api`.

| Method | Path | Auth | Body | Result |
| --- | --- | --- | --- | --- |
| POST | `/auth/register` | No | `{ name, email, password }` | `201 { token, user }` |
| POST | `/auth/login` | No | `{ email, password }` | `200 { token, user }` |
| GET | `/auth/me` | Yes | - | `200 { user }` |
| POST | `/auth/logout` | No | - | `200 { message }` |

Send the token as `Authorization: Bearer <token>`. Passwords are hashed with bcrypt and are never returned in JSON. Wrong email or password returns `401`.

## 5. Application endpoints

Every route below requires a token and is scoped to `owner: req.user._id`.

| Method | Path | Result |
| --- | --- | --- |
| GET | `/applications` | `200 { items, page, pages, total }` |
| GET | `/applications/stats` | `200 { total, byStatus, upcomingFollowUps, upcomingInterviews }` |
| GET | `/applications/export` | `200 text/csv` file download |
| GET | `/applications/:id` | `200 { application }` |
| POST | `/applications` | `201 { application }` |
| PUT | `/applications/:id` | `200 { application }` |
| DELETE | `/applications/:id` | `200 { message }` |

An application belonging to another user looks like a missing record: `404`.

### List and export filters

| Query | Notes |
| --- | --- |
| `search` | Case-insensitive match on job title or company |
| `status` | Saved, Applied, Interview, Offer, Rejected, Withdrawn |
| `employmentType` | Full-time, Part-time, Contract, Internship, Temporary |
| `from`, `to` | ISO dates that bound `dateApplied` |
| `sort` | `dateApplied` (default), `company`, or `jobTitle` |
| `order` | `asc` or `desc` (default) |
| `page`, `limit` | List only; defaults `1` and `10`, maximum limit `50` |

Example:

```text
GET /api/applications?search=engineer&status=Interview&sort=company&order=asc&page=1&limit=10
```

The CSV export uses the same filters but ignores pagination. Every cell is wrapped in double quotes and inner quotes are doubled.

### Create and update fields

```json
{
  "jobTitle": "Frontend Engineer",
  "company": "Northwind Labs",
  "location": "Austin, TX",
  "employmentType": "Full-time",
  "postingUrl": "https://example.com/jobs/123",
  "dateApplied": "2026-11-01",
  "status": "Applied",
  "contactName": "Fictional Recruiter",
  "contactEmail": "recruiter@example.com",
  "notes": "Follow up next week.",
  "followUpDate": "2026-11-10",
  "interviewDate": "2026-11-12"
}
```

Only `jobTitle`, `company`, and `dateApplied` are required on create. `PUT` accepts any subset of these fields. Text fields are trimmed and HTML-escaped; dates must be ISO strings; URLs and emails are checked.

## 6. Seed data

`npm run seed` creates two fictional users and fourteen fictional applications (twelve for the demo user, two for the other user). Re-running it does not duplicate records. Companies and domains are invented examples only.

Demo login: `demo@jobtracker.test` / `Demo@123`
Second login: `other@jobtracker.test` / `Other@123`

## 7. Where things live

```text
src/server.js                       start the HTTP server
src/app.js                          middleware and route mounting
src/config/env.js                   environment values
src/config/db.js                    MongoDB connection helpers
src/models/User.js                  user schema and password helpers
src/models/Application.js           application schema and indexes
src/controllers/auth.controller.js  register, login, me, logout
src/controllers/application.controller.js  CRUD, stats, CSV export
src/routes/                         route tables
src/middleware/                     auth, validation, 404, errors
src/utils/apiResponse.js            shared response helpers
src/utils/csv.js                    CSV formatting
src/seed/seedData.js                idempotent demo data
```
