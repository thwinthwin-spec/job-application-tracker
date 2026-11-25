# Project Structure

ဒီစာရွက်က Job Application Tracker ရဲ့ ဖိုင်တွေကို တစ်ဖိုင်ချင်း ရှင်းပြထားတာပါ။ ဖတ်ရလွယ်အောင် **file tree → root/server/client purpose tables → data flow** ဆိုပြီး စီထားပါတယ်။

## 1. Full file tree

```text
job-application-tracker/
├── .gitignore
├── package.json
├── make-zip.ps1
├── README.md
├── API_DOCUMENTATION.md
├── PROJECT_STRUCTURE.md
├── BEGINNER_GUIDE.md
├── server/
│   ├── .env.example
│   ├── package.json
│   ├── README.md
│   └── src/
│       ├── server.js
│       ├── app.js
│       ├── config/{env.js,db.js}
│       ├── models/{User.js,Application.js}
│       ├── controllers/{auth.controller.js,application.controller.js}
│       ├── routes/{index.js,auth.routes.js,application.routes.js}
│       ├── middleware/{auth.js,validate.js,errorHandler.js,notFound.js}
│       ├── utils/{apiResponse.js,csv.js}
│       └── seed/seedData.js
└── client/
    ├── .env.example
    ├── package.json
    ├── vite.config.js
    ├── index.html
    ├── README.md
    └── src/
        ├── main.jsx, App.jsx, index.css
        ├── api/{axios.js,authApi.js,applicationApi.js}
        ├── context/AuthContext.jsx
        ├── components/{Header,ProtectedRoute,Loading,ErrorMessage,StatusBadge,ApplicationTable,SearchFilterBar,Pagination,ConfirmDialog,EmptyState,StatsCards}.jsx
        ├── pages/{Login,Register,Dashboard,ApplicationList,ApplicationForm,ApplicationDetail,NotFound}Page.jsx
        └── utils/{formatters.js,constants.js}
```

> Tree ထဲမှာ မပါတဲ့ ဖိုင်လမ်းကြောင်းတွေကို ဒီ project မှာ မသုံးပါ။ Install လုပ်ပြီးရင် ထွက်လာတဲ့ dependency folder တွေကို `.gitignore` က ဖယ်ထားပါတယ်။

## 2. Root files

| File | ရည်ရွယ်ချက် |
| --- | --- |
| `.gitignore` | `node_modules`, build output, local secret file, log file တွေကို version control ထဲ မပါအောင် ဖယ်ထားတယ် |
| `package.json` | Root scripts တွေ သတ်မှတ်ထားတယ် — `install:all`, `seed`, `dev:server`, `dev:client`, `build:client` |
| `make-zip.ps1` | PowerShell နဲ့ source တွေကို zip လုပ်ပေးတယ်; `node_modules`, `dist`, `build`, `.git`, `.env`, `.log` တွေ ဖယ်ထားတယ် |
| `README.md` | ရည်ရွယ်ချက်, features, tech stack, install/run, demo account, troubleshooting အကျဉ်း |
| `API_DOCUMENTATION.md` | Base URL, auth header, response shape, status code, endpoint ၁၁ ခု (query case ၁၅ ခု), curl ဥပမာ |
| `PROJECT_STRUCTURE.md` | ဒီစာရွက် — tree, ဖိုင်ရည်ရွယ်ချက်, data flow |
| `BEGINNER_GUIDE.md` | Request တစ်ခု ဘယ်လို စီးဆင်းသလဲ, `useState`/`useEffect`, ownership check ရှင်းလင်းချက် |

### Root folders

| Folder | အကျဉ်း |
| --- | --- |
| `server/` | Express API နဲ့ MongoDB ဆိုင်တာအားလုံး |
| `client/` | React/Vite website ဆိုင်တာအားလုံး |

## 3. Server files

### Server root

| File | ရည်ရွယ်ချက် |
| --- | --- |
| `server/.env.example` | API အတွက် လိုအပ်တဲ့ environment variable ပုံစံ — `PORT`, `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLIENT_ORIGIN`, seed credentials |
| `server/package.json` | Server dependencies (Express, Mongoose, JWT, bcrypt, CORS, dotenv) နဲ့ `dev`, `start`, `seed` scripts |
| `server/README.md` | API ကို သီးခြား run/step လုပ်ချင်သူအတွက် အကျဉ်းလမ်းညွှန် |

### Server entry points

| File | ရည်ရွယ်ချက် |
| --- | --- |
| `server/src/server.js` | `app` ကို import လုပ်ပြီး port `5001` မှာ listen လုပ်တယ် |
| `server/src/app.js` | Express app ဖန်တီး, JSON parser/CORS တပ်, routes တွဲ, error middleware တွေ နောက်ဆုံးမှာ တင်တယ် |

### Config

| File | ရည်ရွယ်ချက် |
| --- | --- |
| `server/src/config/env.js` | Environment values တွေကို တစ်နေရာတည်းက ဖတ်ပြီး validate လုပ်ပေးတယ် |
| `server/src/config/db.js` | `MONGODB_URI` နဲ့ MongoDB ကို connect လုပ်တဲ့ function |

### Models

| File | ရည်ရွယ်ချက် |
| --- | --- |
| `server/src/models/User.js` | User schema — `name`, lowercase unique `email`, bcrypt `password` (`select:false`), timestamps |
| `server/src/models/Application.js` | Application schema — owner ref, job fields, enums, dates, contact, notes, timestamps နဲ့ index ၃ ခု |

`Application` indexes: `owner + dateApplied`, `owner + status`, `owner + followUpDate`။ ဒါကြောင့် သုံးသူရဲ့ data ကို ရှာ/filter/sort တာ မြန်ပါတယ်။

### Controllers

| File | ရည်ရွယ်ချက် |
| --- | --- |
| `server/src/controllers/auth.controller.js` | Register, login, me, logout ရဲ့ business logic |
| `server/src/controllers/application.controller.js` | CRUD, stats, export ရဲ့ business logic; owner scoping ဒီမှာ လုပ်တယ် |

### Routes

| File | ရည်ရွယ်ချက် |
| --- | --- |
| `server/src/routes/index.js` | `/auth` နဲ့ `/applications` router တွေကို `/api` အောက်မှာ စုပေးတယ် |
| `server/src/routes/auth.routes.js` | Auth endpoint ၄ ခုကို controller နဲ့ ချိတ်တယ် |
| `server/src/routes/application.routes.js` | Application endpoint ၇ ခုကို controller နဲ့ ချိတ်တယ်; `/stats`, `/export` ကို `/:id` မတိုင်ခင် တင်ထားတယ် |

### Middleware

| File | ရည်ရွယ်ချက် |
| --- | --- |
| `server/src/middleware/auth.js` | Bearer token ကို ဖတ်ပြီး JWT verify လုပ်, `req.user` ထဲ user id ထည့်ပေးတယ် |
| `server/src/middleware/validate.js` | Request body/query တွေကို required field, enum, date, number စစ်ပေးတယ် |
| `server/src/middleware/errorHandler.js` | Error တွေကို `{success:false,message,errors?}` shape နဲ့ ပြန်ပေးတယ် |
| `server/src/middleware/notFound.js` | မရှိတဲ့ route အတွက် `404` ပြန်ပေးတယ် |

### Utils

| File | ရည်ရွယ်ချက် |
| --- | --- |
| `server/src/utils/apiResponse.js` | Success/error response shape တွေကို တူညီအောင် ပြန်ပေးတဲ့ helper |
| `server/src/utils/csv.js` | Application တွေကို ၁၂ ကောလံပါ CSV header နဲ့ string ပြောင်းပေးတယ် |

### Seed

| File | ရည်ရွယ်ချက် |
| --- | --- |
| `server/src/seed/seedData.js` | Fictional user ၂ ယောက်နဲ့ application ၁၂ + ၂ ခု ဖန်တီးပေးတယ်; နှစ်ကြိမ်တွန်းလို့ duplicate မဖြစ်အောင် စစ်ဆေးတယ် |

## 4. Client files

### Client root

| File | ရည်ရွယ်ချက် |
| --- | --- |
| `client/.env.example` | `VITE_API_URL=http://localhost:5001/api` ပုံစံ ပြထားတယ် |
| `client/package.json` | React, Vite, Axios dependencies နဲ့ `dev`, `build`, `preview` scripts |
| `client/vite.config.js` | Vite server ကို port `5174` မှာ run ဖြစ်အောင် သတ်မှတ်တယ် |
| `client/index.html` | React app တက်တဲ့ root HTML file |
| `client/README.md` | Website ကို သီးခြား run/build လုပ်ချင်သူအတွက် အကျဉ်းလမ်းညွှန် |

### Client entry

| File | ရည်ရွယ်ချက် |
| --- | --- |
| `client/src/main.jsx` | React ကို DOM ထဲ mount လုပ်ပြီး `App` ကို ပထမဆုံး render လုပ်တယ် |
| `client/src/App.jsx` | Route တွေ သတ်မှတ်ပေးတယ်; protected page တွေကို `ProtectedRoute` နဲ့ ပတ်ထားတယ် |
| `client/src/index.css` | တစ် project လုံးသုံးတဲ့ style တွေ — table, card, form, badge, button |

### API helpers

| File | ရည်ရွယ်ချက် |
| --- | --- |
| `client/src/api/axios.js` | `VITE_API_URL` ကို baseURL အဖြစ် သတ်မှတ်ပြီး token ကို header ထဲ အလိုအလျောက် ထည့်ပေးတယ် |
| `client/src/api/authApi.js` | `register`, `login`, `getMe`, `logout` ခေါ်တဲ့ function တွေ |
| `client/src/api/applicationApi.js` | `getApplications`, `getStats`, `exportCsv`, `getApplication`, `createApplication`, `updateApplication`, `deleteApplication` |

### Auth context

| File | ရည်ရွယ်ချက် |
| --- | --- |
| `client/src/context/AuthContext.jsx` | Login user နဲ့ token ကို state ထဲ သိမ်း, page တွေဆီ `useAuth()` နဲ့ မျှပေးတယ် |

### Components

| File | ရည်ရွယ်ချက် |
| --- | --- |
| `client/src/components/Header.jsx` | Top bar — app name, page link, logout button |
| `client/src/components/ProtectedRoute.jsx` | Token မရှိရင် `LoginPage` ကို redirect လုပ်တယ် |
| `client/src/components/Loading.jsx` | Data စောင့်နေတုန်း loading text ပြတယ် |
| `client/src/components/ErrorMessage.jsx` | API error message ကို ဖတ်ရလွယ်အောင် ပြတယ် |
| `client/src/components/StatusBadge.jsx` | Status အလိုက် အရောင်ရှိ badge ပြတယ် |
| `client/src/components/ApplicationTable.jsx` | Application စာရင်းကို row အဖြစ် ပြပြီး detail/edit/delete link တွေ ပေးတယ် |
| `client/src/components/SearchFilterBar.jsx` | Search, status, employment type, date range, sort control တွေ ပေးတယ် |
| `client/src/components/Pagination.jsx` | Page ပြောင်းဖို့ button တွေ ပြတယ် |
| `client/src/components/ConfirmDialog.jsx` | Delete မလုပ်ခင် ထပ်မေးတဲ့ dialog |
| `client/src/components/EmptyState.jsx` | Data မရှိတဲ့အခါ လမ်းညွှန်စာသား ပြတယ် |
| `client/src/components/StatsCards.jsx` | Dashboard မှာ ဂဏန်း card တွေ ပြတယ် |

### Pages

| File | ရည်ရွယ်ချက် |
| --- | --- |
| `client/src/pages/LoginPage.jsx` | Email/password နဲ့ login form |
| `client/src/pages/RegisterPage.jsx` | User အသစ် ဖန်တီးတဲ့ form |
| `client/src/pages/DashboardPage.jsx` | Stats card တွေနဲ့ အကျဉ်းချုပ် ပြတယ် |
| `client/src/pages/ApplicationListPage.jsx` | Search/filter/sort/pagination နဲ့ စာရင်းပြတယ် |
| `client/src/pages/ApplicationFormPage.jsx` | Application အသစ်ဖန်တီး / ပြင်ဆင်တဲ့ form |
| `client/src/pages/ApplicationDetailPage.jsx` | Application ၁ ခုရဲ့ အသေးစိတ် အချက်အလက် |
| `client/src/pages/NotFoundPage.jsx` | မရှိတဲ့ page အတွက် friendly message |

### Utils

| File | ရည်ရွယ်ချက် |
| --- | --- |
| `client/src/utils/formatters.js` | Date/time နဲ့ text ကို ဖတ်ရလွယ်တဲ့ ပုံစံ ပြောင်းပေးတဲ့ helper |
| `client/src/utils/constants.js` | Status enum, employment type enum, sort option စတဲ့ တန်ဖိုးတွေကို တစ်နေရာတည်းက သတ်မှတ်တယ် |

## 5. Data flow diagram

### A. Application စာရင်း ဖတ်တဲ့ flow (read)

```text
Browser
  |
  | 1. User opens /applications
  v
client/src/pages/ApplicationListPage.jsx
  | 2. useEffect() -> filter/page state ပြောင်းရင် ပြန်ခေါ်
  v
client/src/api/applicationApi.js
  | 3. axios.get("/applications", { params })
  v
client/src/api/axios.js  -->  Authorization: Bearer <token>
  |
  | 4. HTTP GET http://localhost:5001/api/applications?...
  v
server/src/app.js --> server/src/routes/index.js
  |
  v
server/src/routes/application.routes.js
  | 5. auth middleware က token စစ်ပြီး req.user ထည့်
  v
server/src/middleware/auth.js
  |
  v
server/src/controllers/application.controller.js
  | 6. find({ owner: req.user.id, ...filters })
  v
server/src/models/Application.js  -->  MongoDB
  |
  | 7. {items, page, pages, total}
  v
server/src/utils/apiResponse.js
  |
  | 8. JSON response
  v
ApplicationListPage.jsx --> ApplicationTable.jsx + Pagination.jsx
```

### B. Application အသစ်ဖန်တီးတဲ့ flow (create)

```text
ApplicationFormPage.jsx  (form submit)
  -> applicationApi.js  (createApplication)
  -> axios.js  (token header)
  -> application.routes.js  (POST /applications + auth + validate)
  -> application.controller.js  (owner = req.user.id)
  -> Application.js  (Mongoose document)
  -> MongoDB  (insert)
  -> apiResponse.js  (201 + application)
  -> Dashboard/List page ကို ပြန်ရောက်ပြီး UI update
```

### C. Ownership check flow

```text
Request id=ABC
  |
  v
application.controller.js: findOne({ _id: "ABC", owner: req.user.id })
  |
  +--> တွေ့ရင် -> 200 / update / delete ဆက်လုပ်
  |
  +--> မတွေ့ရင် -> 404 Not Found
           (id ရှိပေမယ့် အခြား user ပိုင်ဖြစ်နေရင်လည်း ဒီလိုပဲ ပြန်တယ်)
```

ဒီနည်းကြောင့် user တစ်ယောက်က တခြားသူရဲ့ id ကို သိနေရင်တောင် သူ့ data ကို ဖတ်/ပြင်/ဖျက် လုပ်လို့ မရပါဘူး။

## 6. Ports အကျဉ်း

| ပိုင်း | Port | Base URL |
| --- | --- | --- |
| API (`server/`) | `5001` | `http://localhost:5001/api` |
| Website (`client/`) | `5174` | `http://localhost:5174` |

ဒီ port နှစ်ခုက အခြား project နဲ့ မတိုက်မိအောင် ရွေးထားတာပါ။ Install/run အသေးစိတ်ကို [README.md](./README.md) မှာ၊ endpoint အသေးစိတ်ကို [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) မှာ ကြည့်ပါ။
