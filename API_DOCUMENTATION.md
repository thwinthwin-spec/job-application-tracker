# API Documentation

ဒီစာရွက်က Job Application Tracker ရဲ့ REST API ကို ရှင်းပြထားတာပါ။ English technical term တွေကို မူရင်းအတိုင်း ထားပြီး ရှင်းလင်းချက်ကို မြန်မာလို ရေးထားပါတယ်။

## 1. Base URL

API အားလုံးက ဒီ base URL အောက်မှာ ရှိပါတယ်။

```text
http://localhost:5001/api
```

ဒီစာရွက်မှာ path ကို `/auth/register` လို့ ရေးရင် တကယ့် URL က `http://localhost:5001/api/auth/register` ဖြစ်ပါတယ်။

Port `5001` ကို website ရဲ့ `5174` နဲ့ မတိုက်မိအောင် ရွေးထားတာပါ။

## 2. Authentication (Auth header)

Register သို့မဟုတ် login လုပ်ပြီးရင် `token` ရပါတယ်။ Protected endpoint တွေကို ခေါ်တဲ့အခါ ဒီ token ကို header ထဲ ထည့်ပါ။

```http
Authorization: Bearer <token>
```

- **Public:** token မလိုပါ — `/auth/register`, `/auth/login`
- **Protected:** token လိုပါ — `/auth/me`, `/auth/logout`, `/applications` အားလုံး
- Token မပါရင် သို့မဟုတ် ကုန်ပြီးရင် `401 Unauthorized` ပြန်ပါတယ်။

## 3. Response shapes

API က JSON ကို အမြဲ ဒီပုံစံနဲ့ ပြန်ပါတယ်။ Endpoint ဇယားထဲမှာ `{token,user}` လို့ အတိုကောက် ရေးထားရင် `data` အထဲက အဓိပ္ပာယ်ဖြစ်ပါတယ်။

### Single data (အချက်အလက် ၁ ခု)

```json
{ "success": true, "message": "Application created", "data": { "application": { "_id": "...", "jobTitle": "Frontend Developer", "company": "Example Studio", "status": "Applied" } } }
```

### List data (စာရင်း)

```json
{ "success": true, "data": { "items": [], "page": 1, "pages": 0, "total": 0 } }
```

`page` = လက်ရှိ စာမျက်နှာ, `pages` = စုစုပေါင်း စာမျက်နှာ, `total` = စုစုပေါင်း အရေအတွက်။

### Error (မှားယွင်းချက်)

```json
{ "success": false, "message": "Validation failed", "errors": [{ "field": "email", "message": "Email is required" }] }
```

`errors` က optional ဖြစ်ပါတယ်။ အားလုံးသော error မှာ `errors` ပါစရာမလိုပါဘူး။

## 4. Status codes

| Code | အဓိပ္ပာယ် | ဒီ project မှာ ဘယ်အခါ ပြန်သလဲ |
| --- | --- | --- |
| `200` | OK | Login, read, update, delete, logout အောင်မြင်တာ |
| `201` | Created | Register နဲ့ application အသစ် ဖန်တီးတာ |
| `400` | Bad Request | Missing field, enum မှား, date ပုံစံမှား, query တန်ဖိုးမှား |
| `401` | Unauthorized | Token မပါ / မှား / ကုန်ပြီ, login credentials မှား |
| `403` | Forbidden | Login လုပ်ထားပေမယ့် လုပ်ခွင့်မရှိတာ (ဒီ app မှာ ပိုင်ရှင်မဟုတ်ရင် `404` ပြန်ပါတယ်) |
| `404` | Not Found | Endpoint မရှိတာ သို့မဟုတ် အခြား user ရဲ့ application id ကို တောင်းတာ |
| `409` | Conflict | Email က အရင်ကတည်းက register လုပ်ထားပြီးသား |
| `500` | Internal Server Error | Server ဘက်မှာ မမျှော်လင့်တဲ့ error ဖြစ်တာ |

## 5. Validation နဲ့ sanitization မှတ်ချက်တွေ

| အရာ | စစ်ဆေးပုံ |
| --- | --- |
| `name` | မချည်းဖြစ်ရပါ။ Trim လုပ်ပြီး သိမ်းပါတယ်။ |
| `email` | Valid email ဖြစ်ရပါ။ Lowercase ပြောင်းပြီး သိမ်းပါတယ်။ Unique ဖြစ်ရပါ။ |
| `password` | Required ဖြစ်ပြီး bcrypt hash အဖြစ်ပဲ သိမ်းပါတယ်။ Response မှာ ဘယ်တုန်းကမှ ပြန်မပါပါ။ |
| `jobTitle`, `company` | Application အတွက် မဖြစ်မနေ လိုအပ်ပါတယ်။ |
| `employmentType` | `Full-time`, `Part-time`, `Contract`, `Internship`, `Temporary` ထဲက တစ်ခုသာ ဖြစ်ရပါ။ |
| `status` | `Saved`, `Applied`, `Interview`, `Offer`, `Rejected`, `Withdrawn` ထဲက တစ်ခုသာ ဖြစ်ရပါ။ |
| `dateApplied`, `followUpDate`, `interviewDate` | Valid date ဖြစ်ရပါ။ `from` က `to` ထက် နောက်မနေရပါ။ |
| `postingUrl` | URL ပုံစံ ဖြစ်သင့်ပါတယ်။ |
| Text fields | Trim လုပ်ပါတယ်။ React က UI မှာ text ကို escape လုပ်ပေးလို့ HTML ကို code အဖြစ် မမြင်ရပါ။ |
| `page`, `limit` | Positive integer ဖြစ်ရပါ။ |
| `sort` | `dateApplied`, `company`, `jobTitle` ထဲက တစ်ခုသာ ဖြစ်ရပါ။ |
| `order` | `asc` သို့မဟုတ် `desc` သာ ဖြစ်ရပါ။ |
| `owner` | Client က ပို့တာကို လက်မခံပါ။ Token ထဲက user id ကိုသာ server က သတ်မှတ်ပါတယ်။ |

Invalid ObjectId တစ်ခု ပို့ရင် `400` ပြန်ပါတယ်။ ရှိမရှိ မစစ်ခင် format ကို စစ်တာဖြစ်ပါတယ်။

## 6. Security decisions

- **Owner scoping:** Application တိုင်းမှာ `owner` (ref User) ပါတယ်။ List, stats, export, read, update, delete အားလုံးက `owner: req.user.id` နဲ့ တွဲစစ်ပါတယ်။
- **404 for someone else's record:** တခြား user ရဲ့ application id ကို တောင်းရင် `403` အစား `404 Not Found` ပြန်ပါတယ်။ ဒါကြောင့် id တစ်ခု ရှိ/မရှိ သိရှိခွင့် မပေးဘူး။
- **bcrypt:** Password ကို bcrypt hash အဖြစ်ပဲ သိမ်းပါတယ်။ Mongoose model မှာ `select: false` ဖြစ်တာကြောင့် query လုပ်တဲ့အခါ default အနေနဲ့ ပြန်မပါပါ။
- **JWT:** Login ပြီးရင် `JWT_SECRET` နဲ့ လက်မှတ်ထိုးထားတဲ့ token ပေးပါတယ်။ `JWT_EXPIRES_IN=7d` အတိုင်း ၇ ရက်အကြာ ကုန်ပါတယ်။
- **`.env`:** Secret, database URI, seed credentials တွေကို `.env` ထဲမှာ ထားပြီး source code ထဲ မရေးပါ။ `.env.example` မှာ ပုံစံပဲ ပါတယ်။
- **CORS:** `CLIENT_ORIGIN=http://localhost:5174` ကနေလာတဲ့ request ကိုပဲ ခွင့်ပြုပါတယ်။
- **Create safety:** `POST /applications` မှာ client က `owner` ပို့ပေးစရာမလိုပါ။ ပို့လိုက်ရင်လည်း server က လျစ်လျူရှုပါတယ်။

## 7. Endpoint အကျဉ်း

API မှာ **endpoint ၁၁ ခု** ရှိပါတယ်။ `GET /applications` ကို query ပုံစံ ၄ မျိုးခွဲပြထားလို့ ဒီစာရွက်မှာ **လေ့လာရေး အကြောင်းအရာ ၁၅ ခု** ဖြစ်ပါတယ်။ ၁၂–၁၅ က အသစ်ထပ်တဲ့ endpoint မဟုတ်ဘဲ အဆိုပါ endpoint ကို မတူတဲ့ request နဲ့ ခေါ်တာသာ ဖြစ်ပါတယ်။

| # | Method | Path (base `/api` နဲ့) | Access | ရည်ရွယ်ချက် |
| --- | --- | --- | --- | --- |
| 1 | `POST` | `/auth/register` | Public | User အသစ် ဖန်တီး |
| 2 | `POST` | `/auth/login` | Public | Token ရယူ |
| 3 | `GET` | `/auth/me` | Protected | လက်ရှိ user ကြည့် |
| 4 | `POST` | `/auth/logout` | Protected | Logout message ရယူ |
| 5 | `GET` | `/applications` | Protected | Application စာရင်း |
| 6 | `GET` | `/applications/stats` | Protected | Dashboard ဂဏန်းတွေ |
| 7 | `GET` | `/applications/export` | Protected | CSV download |
| 8 | `GET` | `/applications/:id` | Protected | Application ၁ ခု ကြည့် |
| 9 | `POST` | `/applications` | Protected | Application အသစ် ဖန်တီး |
| 10 | `PUT` | `/applications/:id` | Protected | Application ပြင် |
| 11 | `DELETE` | `/applications/:id` | Protected | Application ဖျက် |
| 12 | `GET` | `/applications?status=...&employmentType=...` | Protected | Filter လုပ်နည်း |
| 13 | `GET` | `/applications?from=...&to=...` | Protected | Date range ရွေးနည်း |
| 14 | `GET` | `/applications?sort=...&order=...` | Protected | Sort လုပ်နည်း |
| 15 | `GET` | `/applications?page=...&limit=...` | Protected | Pagination သုံးနည်း |

> Route တွေကို router တွေမှာ `/applications` အောက်မှာ စီထားတာကြောင့် `/stats` နဲ့ `/export` ကို `/:id` မတိုင်ခင် ကြိုတင်တင်ထားရပါတယ်။ ဒါမှ `stats` ဆိုတဲ့ စကားလုံးကို id အဖြစ် မယူမိပါဘူး။

---

## 8. Endpoint အသေးစိတ်

### 1) Register — user အသစ်ဖန်တီး

- **Method / Path:** `POST /api/auth/register`
- **Access:** Public
- **Request body:**

```json
{
  "name": "Demo User",
  "email": "demo@jobtracker.test",
  "password": "Demo@123"
}
```

- **Success (201):**

```json
{ "success": true, "message": "Registered successfully", "data": { "token": "<jwt>", "user": { "_id": "...", "name": "Demo User", "email": "demo@jobtracker.test" } } }
```

- **Error:** `400` (field မပြည့် / email ပုံစံမှား), `409` (email ရှိပြီးသား), `500`

### 2) Login — token ရယူ

- **Method / Path:** `POST /api/auth/login`
- **Access:** Public
- **Request body:**

```json
{ "email": "demo@jobtracker.test", "password": "Demo@123" }
```

- **Success (200):**

```json
{ "success": true, "message": "Logged in successfully", "data": { "token": "<jwt>", "user": { "_id": "...", "email": "demo@jobtracker.test" } } }
```

- **Error:** `400` (email/password မပါ), `401` (email သို့မဟုတ် password မှား), `500`

### 3) Me — လက်ရှိ user ကြည့်

- **Method / Path:** `GET /api/auth/me`
- **Access:** Protected (`Authorization: Bearer <token>`)
- **Request:** body မလိုပါ။
- **Success (200):**

```json
{ "success": true, "message": "Current user", "data": { "user": { "_id": "...", "name": "Demo User", "email": "demo@jobtracker.test" } } }
```

- **Error:** `401` (token မပါ/မှား/ကုန်), `404` (token ထဲက user မတွေ့တော့), `500`

### 4) Logout

- **Method / Path:** `POST /api/auth/logout`
- **Access:** Protected
- **Request:** body မလိုပါ။
- **Success (200):**

```json
{ "success": true, "message": "Logged out successfully", "data": null }
```

- **Error:** `401`, `500`

> JWT က stateless ဖြစ်တာကြောင့် server က token ကို စာရင်းချုပ်ဖျက်တာမဟုတ်ဘူး။ Client က သိမ်းထားတဲ့ token ကို ဖယ်ရှားပြီး ဒီ message ကို ပြတာဖြစ်ပါတယ်။

### 5) Applications list — အခြေခံ စာရင်း

- **Method / Path:** `GET /api/applications`
- **Access:** Protected
- **Request:** query မပါရင် login ထားသူရဲ့ application အားလုံးကို page ခွဲပြီး ပြန်ပါတယ်။
- **Success (200):**

```json
{ "success": true, "data": { "items": [{ "_id": "...", "jobTitle": "Frontend Developer", "company": "Example Studio", "status": "Applied" }], "page": 1, "pages": 2, "total": 12 } }
```

- **Error:** `400` (query တန်ဖိုးမှား), `401`, `500`

### 6) Stats — Dashboard ဂဏန်းတွေ

- **Method / Path:** `GET /api/applications/stats`
- **Access:** Protected
- **Request:** query မလိုပါ။
- **Success (200):**

```json
{ "success": true, "message": "Application stats", "data": { "total": 12, "byStatus": { "Saved": 3, "Applied": 5, "Interview": 2, "Offer": 1, "Rejected": 1, "Withdrawn": 0 }, "upcomingFollowUps": 2, "upcomingInterviews": 1 } }
```

- **Error:** `401`, `500`

`upcomingFollowUps` နဲ့ `upcomingInterviews` က မနက်ဖြန်ကနေ ရှေ့ကို ရှိတဲ့ နေ့စွဲတွေကို ရေတွက်တာဖြစ်ပါတယ်။

### 7) Export — CSV download

- **Method / Path:** `GET /api/applications/export`
- **Access:** Protected
- **Request:** query မလိုပါ။ Login ထားသူရဲ့ application အားလုံးကို export လုပ်ပေးပါတယ်။
- **Success (200):** JSON အစား `text/csv` ဖြစ်ပါတယ်။

```csv
Job Title,Company,Location,Employment Type,Posting URL,Date Applied,Status,Contact Name,Contact Email,Notes,Follow-up Date,Interview Date
```

- **Error:** `401`, `500`

CSV header က အပေါ်ကအတိုင်း **၁၂ ကောလံ** ဖြစ်ပါတယ်။ comma ပါတဲ့ text တွေကို quote လုပ်ပေးပါတယ်။

### 8) Get one — Application ၁ ခုကြည့်

- **Method / Path:** `GET /api/applications/:id`
- **Access:** Protected
- **Request:** path ထဲမှာ application id ထည့်ပါ။
- **Success (200):**

```json
{ "success": true, "message": "Application found", "data": { "application": { "_id": "...", "jobTitle": "Frontend Developer", "company": "Example Studio" } } }
```

- **Error:** `400` (ObjectId ပုံစံမှား), `401`, `404` (မတွေ့ သို့မဟုတ် အခြား user ပိုင်), `500`

### 9) Create — Application အသစ်ဖန်တီး

- **Method / Path:** `POST /api/applications`
- **Access:** Protected
- **Request body:**

```json
{
  "jobTitle": "Backend Developer",
  "company": "River Labs",
  "location": "Yangon",
  "employmentType": "Full-time",
  "postingUrl": "https://example.test/jobs/backend",
  "dateApplied": "2026-11-20",
  "status": "Applied",
  "contactName": "Maung Maung",
  "contactEmail": "maung@example.test",
  "notes": "Follow up next week",
  "followUpDate": "2026-11-27",
  "interviewDate": "2026-12-03"
}
```

- **Success (201):**

```json
{ "success": true, "message": "Application created", "data": { "application": { "_id": "...", "jobTitle": "Backend Developer", "status": "Applied", "owner": "..." } } }
```

- **Error:** `400` (required field မပါ / enum မှား), `401`, `500`

### 10) Update — Application ပြင်

- **Method / Path:** `PUT /api/applications/:id`
- **Access:** Protected
- **Request body:** ပြင်ချင်တဲ့ field တွေပဲ ပို့လို့ရပါတယ်။

```json
{ "status": "Interview", "interviewDate": "2026-12-10", "notes": "HR call confirmed" }
```

- **Success (200):**

```json
{ "success": true, "message": "Application updated", "data": { "application": { "_id": "...", "status": "Interview", "interviewDate": "2026-12-10T00:00:00.000Z" } } }
```

- **Error:** `400` (ObjectId/enum/date မှား), `401`, `404` (မတွေ့ သို့မဟုတ် အခြား user ပိုင်), `500`

### 11) Delete — Application ဖျက်

- **Method / Path:** `DELETE /api/applications/:id`
- **Access:** Protected
- **Request:** path ထဲမှာ application id ထည့်ပါ။ body မလိုပါ။
- **Success (200):**

```json
{ "success": true, "message": "Application deleted", "data": null }
```

- **Error:** `400`, `401`, `404` (မတွေ့ သို့မဟုတ် အခြား user ပိုင်), `500`

### 12) List — status / employmentType filter

- **Method / Path:** `GET /api/applications?status=Applied&employmentType=Full-time`
- **Access:** Protected
- **Request:** query string ထဲမှာ တန်ဖိုးတွေ ထည့်ပါ။ နှစ်ခုလုံး တွဲသုံးလို့ရပါတယ်။
- **Success (200):** `#5` နဲ့ အတူတူပါ။ `items` ထဲမှာ ကိုက်ညီတာတွေပဲ ပါပါတယ်။

```json
{ "success": true, "data": { "items": [{ "status": "Applied", "employmentType": "Full-time" }], "page": 1, "pages": 1, "total": 4 } }
```

- **Error:** `400` (enum ထဲမပါတဲ့ တန်ဖိုး), `401`, `500`

### 13) List — date range (`from`, `to`)

- **Method / Path:** `GET /api/applications?from=2026-11-01&to=2026-11-30`
- **Access:** Protected
- **Request:** `dateApplied` ကို ဒီ range ထဲမှာ ရှိတာတွေ ရွေးပါတယ်။
- **Success (200):** `#5` ပုံစံအတိုင်း ဖြစ်ပါတယ်။

```json
{ "success": true, "data": { "items": [{ "dateApplied": "2026-11-20T00:00:00.000Z" }], "page": 1, "pages": 1, "total": 7 } }
```

- **Error:** `400` (`from > to` ဖြစ်တာ သို့မဟုတ် date ပုံစံမှား), `401`, `500`

### 14) List — sort (`sort`, `order`)

- **Method / Path:** `GET /api/applications?sort=company&order=asc`
- **Access:** Protected
- **Request:** `sort=dateApplied|company|jobTitle`, `order=asc|desc`
- **Success (200):** `#5` ပုံစံအတိုင်း ဖြစ်ပြီး `items` က ရွေးထားတဲ့ အစဉ်အတိုင်း ဖြစ်ပါတယ်။

```json
{ "success": true, "data": { "items": [{ "company": "Alpha Co" }, { "company": "Beta Co" }], "page": 1, "pages": 1, "total": 2 } }
```

- **Error:** `400` (`sort` သို့မဟုတ် `order` တန်ဖိုးမှား), `401`, `500`

### 15) List — pagination (`page`, `limit`)

- **Method / Path:** `GET /api/applications?page=2&limit=10`
- **Access:** Protected
- **Request:** `page` က ၁ ကနေ စပါတယ်။ `limit` က တစ်မျက်နှာက အရေအတွက်။
- **Success (200):**

```json
{ "success": true, "data": { "items": [], "page": 2, "pages": 2, "total": 12 } }
```

- **Error:** `400` (`page`/`limit` က နံပါတ်မဟုတ် သို့မဟုတ် ၀ အောက်), `401`, `500`

Client က အများအားဖြင့် `page=1`, `limit=10`, `sort=dateApplied`, `order=desc` ကို default အနေနဲ့ ပို့လေ့ရှိပါတယ်။

## 9. Filter / sort / pagination query table

| Query | ရနိုင်တဲ့တန်ဖိုး | လုပ်ဆောင်ချက် |
| --- | --- | --- |
| `search` | စာသား | `jobTitle`, `company`, `location`, `contactName` တွေထဲ ရှာပါတယ် |
| `status` | `Saved`, `Applied`, `Interview`, `Offer`, `Rejected`, `Withdrawn` | Status အလိုက် ရွေးပါတယ် |
| `employmentType` | `Full-time`, `Part-time`, `Contract`, `Internship`, `Temporary` | အလုပ်အမျိုးအစား အလိုက် ရွေးပါတယ် |
| `from` | `YYYY-MM-DD` သို့မဟုတ် ISO date | `dateApplied` အနည်းဆုံးနေ့ |
| `to` | `YYYY-MM-DD` သို့မဟုတ် ISO date | `dateApplied` အမြင့်ဆုံးနေ့ |
| `sort` | `dateApplied`, `company`, `jobTitle` | ဘယ် field နဲ့ စီမလဲ |
| `order` | `asc`, `desc` | အတက်စီ / အဆင်းစီ |
| `page` | positive integer | စာမျက်နှာနံပါတ် |
| `limit` | positive integer | တစ်မျက်နှာက item အရေအတွက် |

Query တွေကို `&` နဲ့ တွဲပြီး တစ်ချိန်တည်း သုံးလို့ရပါတယ်။ ဥပမာ — `?search=react&status=Applied&from=2026-11-01&sort=dateApplied&order=desc&page=1&limit=10`

## 10. CSV format

Export response က JSON မဟုတ်ပါဘူး။ Browser က file အဖြစ် download လုပ်ပါတယ်။

- **Content-Type:** `text/csv; charset=utf-8`
- **Header row (အတိအကျ):**

```csv
Job Title,Company,Location,Employment Type,Posting URL,Date Applied,Status,Contact Name,Contact Email,Notes,Follow-up Date,Interview Date
```

- တစ်ကြောင်း = application ၁ ခု။
- Notes ထဲမှာ comma, quote သို့မဟုတ် newline ပါရင် quote နဲ့ ပတ်ပေးပါတယ်။
- Login ထားသူရဲ့ ကိုယ်ပိုင် application တွေပဲ ပါပါတယ်။

## 11. curl ဥပမာတွေ

Terminal မှာ တိုက်ရိုက် စမ်းလို့ရပါတယ်။ `$TOKEN` နဲ့ `$ID` ကို ကိုယ်ရဲ့ တန်ဖိုးနဲ့ အစားထိုးပါ။

### Register

```bash
curl -X POST "http://localhost:5001/api/auth/register" -H "Content-Type: application/json" -d "{\"name\":\"Demo User\",\"email\":\"newuser@jobtracker.test\",\"password\":\"Demo@123\"}"
```

### Login

```bash
curl -X POST "http://localhost:5001/api/auth/login" -H "Content-Type: application/json" -d "{\"email\":\"demo@jobtracker.test\",\"password\":\"Demo@123\"}"
```

### List filtered

```bash
curl -X GET "http://localhost:5001/api/applications?search=developer&status=Applied&sort=dateApplied&order=desc&page=1&limit=10" -H "Authorization: Bearer $TOKEN"
```

### Create

```bash
curl -X POST "http://localhost:5001/api/applications" -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d "{\"jobTitle\":\"Backend Developer\",\"company\":\"River Labs\",\"location\":\"Yangon\",\"employmentType\":\"Full-time\",\"postingUrl\":\"https://example.test/jobs/backend\",\"dateApplied\":\"2026-11-20\",\"status\":\"Applied\",\"contactName\":\"Maung Maung\",\"contactEmail\":\"maung@example.test\",\"notes\":\"Follow up next week\",\"followUpDate\":\"2026-11-27\"}"
```

### Update

```bash
curl -X PUT "http://localhost:5001/api/applications/$ID" -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d "{\"status\":\"Interview\",\"interviewDate\":\"2026-12-10\"}"
```

### Delete

```bash
curl -X DELETE "http://localhost:5001/api/applications/$ID" -H "Authorization: Bearer $TOKEN"
```

### Stats

```bash
curl -X GET "http://localhost:5001/api/applications/stats" -H "Authorization: Bearer $TOKEN"
```

### Export CSV

```bash
curl -L "http://localhost:5001/api/applications/export" -H "Authorization: Bearer $TOKEN" -o "<download-file>.csv"
```

## 12. Client နဲ့ ဆက်စပ်ပုံ

| Client file | လုပ်ဆောင်ချက် |
| --- | --- |
| `client/src/api/axios.js` | Base URL နဲ့ token header ကို တစ်နေရာတည်းက သတ်မှတ်ပေးတယ် |
| `client/src/api/authApi.js` | Register/login/me/logout ခေါ်တဲ့ helper တွေ |
| `client/src/api/applicationApi.js` | List/create/update/delete/stats/export ခေါ်တဲ့ helper တွေ |
| `client/src/context/AuthContext.jsx` | Token ကို သိမ်းပြီး protected page တွေကို စစ်ပေးတယ် |
| `client/src/components/ProtectedRoute.jsx` | Token မရှိရင် Login page ကို ပို့ပေးတယ် |

အကုန်လုံးကို တစ်ဆင့်ချင်း နားလည်ချင်ရင် [BEGINNER_GUIDE.md](./BEGINNER_GUIDE.md) ကို ဖတ်ပါ။
