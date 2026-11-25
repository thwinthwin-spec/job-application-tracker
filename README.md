# Job Application Tracker

Job Application Tracker ဟာ ကိုယ်လျှောက်ထားခဲ့တဲ့ အလုပ်တွေကို တစ်နေရာတည်းမှာ မှတ်သား၊ ရှာဖွေ၊ စီမံခန့်ခွဲဖို့အတွက် ရေးထားတဲ့ full-stack app တစ်ခုပါ။ Excel file တွေ အများကြီးထဲ ရှာနေစရာမလိုဘဲ လျှောက်လွှာအခြေအနေ၊ နောက်ဆက်တွဲလုပ်ရမယ့်နေ့ (follow-up date) နဲ့ စမ်းသပ်မှုနေ့ (interview date) တွေကို ရှင်းရှင်းလင်းလင်း မြင်နိုင်ပါတယ်။

ဒီ project မှာ အဓိက အပိုင်း ၂ ပိုင်း ရှိပါတယ်။

- **server/** — Express API + MongoDB (data သိမ်းတဲ့နေရာ)
- **client/** — React/Vite website (အသုံးပြုသူ မြင်ရတဲ့နေရာ)

## ရည်ရွယ်ချက်

အလုပ်ရှာနေတဲ့သူတစ်ယောက်အနေနဲ့ အောက်ပါအချက်တွေ လွယ်လွယ်လုပ်နိုင်အောင် ဒီ app က ကူညီပါတယ်။

- လျှောက်ထားခဲ့တဲ့ ကုမ္ပဏီ၊ ရာထူး၊ နေရာ၊ posting URL တွေ မှတ်ထားခြင်း
- `Saved`, `Applied`, `Interview`, `Offer`, `Rejected`, `Withdrawn` စတဲ့ status တွေနဲ့ အခြေအနေ ခွဲခြားခြင်း
- Follow-up လုပ်ရမယ့်နေ့နဲ့ interview နေ့တွေကို မမေ့အောင် စစ်ဆေးခြင်း
- Search, status filter, employment type filter, date range filter တွေနဲ့ လိုချင်တာကို မြန်မြန်ရှာခြင်း
- Sort နဲ့ pagination သုံးပြီး များတဲ့ data တွေကို စနစ်တကျ ကြည့်ခြင်း
- Dashboard မှာ စုစုပေါင်းအရေအတွက်၊ status အလိုက် အရေအတွက်၊ မကြာခင် လုပ်ရမယ့် အရာတွေကို ကြည့်ခြင်း
- CSV export နဲ့ အချက်အလက်တွေကို spreadsheet ထဲ ယူသွားခြင်း
- Login လုပ်ထားသူတစ်ယောက်ရဲ့ ကိုယ်ပိုင် data ကိုပဲ မြင်ရအောင် ကာကွယ်ခြင်း

> **မှတ်ချက်:** ဒီ project ထဲက နမူနာအချက်အလက်အားလုံးက **fictional** (ဇာတ်လမ်းထဲကသာ) ဖြစ်ပါတယ်။

## Tech stack

| အပိုင်း | သုံးထားတာ | ရှင်းလင်းချက် |
| --- | --- | --- |
| API | Node.js, Express | HTTP request တွေ လက်ခံပြီး response ပြန်ပေးတယ် |
| Database | MongoDB, Mongoose | Application နဲ့ User data တွေ သိမ်းတယ် |
| Auth | JWT, bcrypt | Token နဲ့ login ထားခြင်း၊ password ကို hash လုပ်သိမ်းခြင်း |
| Website | React, Vite | Page တွေ၊ form တွေ၊ table တွေ ဖန်တီးတယ် |
| HTTP client | Axios | Client က API ကို ခေါ်ဖို့ သုံးတယ် |
| State | React Context API | Login ထားတဲ့ user အချက်အလက်ကို page တွေဆီ မျှသုံးတယ် |
| Styling | CSS (`index.css`) | ရိုးရှင်းပြီး ဖတ်ရလွယ်တဲ့ UI |
| Tools | npm, PowerShell (`make-zip.ps1`) | Install/run/zip လုပ်ဖို့ |

## Folder summary

| နေရာ | အကျဉ်း |
| --- | --- |
| `.gitignore` | `node_modules`, build output, secret file တွေကို git ထဲ မပါအောင် ဖယ်ထားတယ် |
| `package.json` | Root scripts (`install:all`, `seed`, `dev:server`, `dev:client`, `build:client`) တွေ ပါတယ် |
| `make-zip.ps1` | Project ကို zip လုပ်ပေးတဲ့ PowerShell script |
| `README.md` | ဒီစာရွက် — install/run လုပ်နည်း အကျဉ်း |
| `API_DOCUMENTATION.md` | Endpoint တွေ၊ request/response ပုံစံ၊ curl ဥပမာတွေ |
| `PROJECT_STRUCTURE.md` | File tree အပြည့်အစုံနဲ့ ဖိုင်တိုင်းရဲ့ ရည်ရွယ်ချက် |
| `BEGINNER_GUIDE.md` | "Create application" request တစ်ခု ဘယ်လို စီးဆင်းသလဲ ရှင်းပြထားတယ် |
| `server/` | API, config, models, controllers, routes, middleware, utils, seed |
| `client/` | React pages, components, api helpers, auth context, utils |

အသေးစိတ် tree ကို [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) မှာ ကြည့်ပါ။

## Prerequisites

မစတင်ခင် ဒီအရာတွေ ရှိထားပါ။

1. **Node.js 18+** နဲ့ **npm** — `node -v` နဲ့ `npm -v` လို့ ရိုက်ပြီး စစ်လို့ရပါတယ်။
2. **MongoDB** ကို ဒီမှာ run ဖြစ်နေရမယ် — `mongodb://127.0.0.1:27017/job_tracker`
3. **PowerShell** — zip လုပ်ချင်ရင် `make-zip.ps1` အတွက် လိုအပ်ပါတယ်။
4. Code editor တစ်ခု (ဥပမာ VS Code)။

**Ports:** API က `5001`, website က `5174` ကို သုံးပါတယ်။ အခြား project နဲ့ port မတိုက်မိအောင် ဒီနံပါတ်တွေကို ရွေးထားတာပါ။

## Install လုပ်နည်း

Project root (`job-application-tracker` ရှိတဲ့နေရာ) မှာ terminal ဖွင့်ပြီး:

```powershell
npm run install:all
```

ဒီ script က `server` နဲ့ `client` နှစ်ခုလုံးအတွက် dependencies တွေ တပ်ဆင်ပေးပါတယ်။ တစ်ခုချင်းစီ လုပ်ချင်ရင်လည်း `npm install --prefix server` နဲ့ `npm install --prefix client` ကို သုံးလို့ရပါတယ်။

## Environment setup

### API (`server/.env.example` အခြေခံ)

`server/.env.example` ထဲမှာ လိုအပ်တဲ့ key တွေ ရှိပါတယ်။ ဒီတန်ဖိုးတွေကို သတ်မှတ်ပါ။

| Variable | တန်ဖိုး / ရည်ရွယ်ချက် |
| --- | --- |
| `PORT` | `5001` — API နားထောင်မယ့် port |
| `MONGODB_URI` | `mongodb://127.0.0.1:27017/job_tracker` |
| `JWT_SECRET` | ကိုယ်ရေးကိုယ်တာ လျှို့ဝှက် string — တကယ့် project မှာ ပြောင်းပါ |
| `JWT_EXPIRES_IN` | `7d` — token ၇ ရက်အကြာ ကုန်တယ် |
| `CLIENT_ORIGIN` | `http://localhost:5174` — React က လာတဲ့ request ကို ခွင့်ပြုတယ် |
| `SEED_USER_EMAIL` | `demo@jobtracker.test` |
| `SEED_USER_PASSWORD` | `Demo@123` |
| `SEED_OTHER_EMAIL` | `other@jobtracker.test` |
| `SEED_OTHER_PASSWORD` | `Other@123` |

### Website (`client/.env.example` အခြေခံ)

| Variable | တန်ဖိုး |
| --- | --- |
| `VITE_API_URL` | `http://localhost:5001/api` |

> Secret တွေကို git ထဲ မထည့်ပါနဲ့။ `.gitignore` က ကာကွယ်ပေးပေမယ့် မျှသုံးတဲ့အခါ `.env.example` ပုံစံကိုပဲ မျှပါ။

## Seed လုပ်နည်း

```powershell
npm run seed
```

Seed က **idempotent** ဖြစ်ပါတယ် — နှစ်ကြိမ်တွန်းလို့ duplicate data မဖြစ်ပါဘူး။ ဒီလို ဖန်တီးပေးပါတယ်။

| Account | Application အရေအတွက် |
| --- | --- |
| `demo@jobtracker.test` / `Demo@123` | 12 (fictional) |
| `other@jobtracker.test` / `Other@123` | 2 (fictional) |

## Run လုပ်နည်း

Terminal **၂ ခု** ဖွင့်ပြီး project root ကနေ အောက်ပါအတိုင်း လုပ်ပါ။

**Terminal 1 — API**

```powershell
npm run dev:server
```

**Terminal 2 — Website**

```powershell
npm run dev:client
```

ပြီးရင် ဒီလင့်တွေကို ဖွင့်ပါ။

- Website: `http://localhost:5174`
- API base: `http://localhost:5001/api`

Production အတွက် website ကို build လုပ်ချင်ရင်:

```powershell
npm run build:client
```

## Demo credentials

| အီးမေးလ် | Password | မှတ်ချက် |
| --- | --- | --- |
| `demo@jobtracker.test` | `Demo@123` | နမူနာ application ၁၂ ခု ပါတယ် |
| `other@jobtracker.test` | `Other@123` | နမူနာ application ၂ ခု ပါတယ် — သီးခြား user |

ဒီ account နှစ်ခုနဲ့ login လုပ်ပြီး တစ်ယောက်ရဲ့ data က အခြားသူဆီ မမြင်ရတာကို စမ်းကြည့်နိုင်ပါတယ်။

## Sample-data privacy note

- နမူနာ ကုမ္ပဏီ၊ လူနာမည်၊ အီးမေးလ်၊ URL နဲ့ မှတ်ချက်အားလုံး **fictional** ဖြစ်ပါတယ်။ တကယ့်လူ သို့မဟုတ် တကယ့်ကုမ္ပဏီကို ကိုယ်စားမပြုပါဘူး။
- Demo account တွေကို စမ်းသပ်ရုံသာ သုံးပါ။ တကယ့် အသုံးပြုမယ်ဆိုရင် password နဲ့ `JWT_SECRET` ကို ပြောင်းပါ။
- ကိုယ်ရေးကိုယ်တာ အချက်အလက်တွေကို demo data ထဲ ထည့်မရေးပါနဲ့။

## အမြန်စမ်းသပ်နည်း (smoke test)

1. MongoDB run နေပြီး environment values ပြည့်နေပါစေ။
2. `npm run install:all` → `npm run seed` တွန်းပါ။
3. `npm run dev:server` နဲ့ `npm run dev:client` ကို terminal ၂ ခုမှာ ဖွင့်ပါ။
4. Website မှာ `demo@jobtracker.test` / `Demo@123` နဲ့ login လုပ်ပါ။
5. Dashboard မှာ stats တွေ မြင်ရပါမယ်။ Application တစ်ခု ဖန်တီး၊ ပြင်၊ ရှာ၊ export လုပ်ကြည့်ပါ။
6. `other@jobtracker.test` နဲ့ login ပြောင်းပြီး ပထမ account ရဲ့ application ကို မမြင်ရတာ စစ်ပါ။

## Troubleshooting

| ပြဿနာ | ဖြစ်နိုင်တဲ့အကြောင်းရင်း | ဖြေရှင်းနည်း |
| --- | --- | --- |
| `ECONNREFUSED 127.0.0.1:27017` | MongoDB မဖွင့်ထားတာ | MongoDB service ကို စတင်ပြီး `MONGODB_URI` ကို ပြန်စစ်ပါ |
| API port `5001` သုံးလို့ မရဘူး | အခြား process က သုံးနေတာ | ကိုယ့် port ကို ပြောင်းပြီး `CLIENT_ORIGIN` နဲ့ `VITE_API_URL` ကို ညှိပါ |
| Website port `5174` သုံးလို့ မရဘူး | အခြား project နဲ့ တိုက်နေတာ | Vite ကို တခြား port ပေးပြီး API ရဲ့ `CLIENT_ORIGIN` ကို ပြောင်းပါ |
| Login မှာ `401` ပြတယ် | Password မှားတာ သို့မဟုတ် token ကုန်ပြီ | Demo credentials ကို ပြန်စစ်ပါ၊ ပြီးရင် logout လုပ်ပြီး ပြန် login လုပ်ပါ |
| CORS error တက်တယ် | `CLIENT_ORIGIN` နဲ့ website URL မကိုက်တာ | `http://localhost:5174` မှန်မမှန် စစ်ပါ |
| Seed မှာ email duplicate ဆိုတယ် | အရင်က seed လုပ်ထားပြီးသား | Seed က idempotent ဖြစ်တာကြောင့် ဆက်လုပ်လို့ရပါတယ်; error ဆိုရင် env email တွေ ပြန်စစ်ပါ |
| `npm` command မတွေ့ဘူး | Node.js မတပ်ထားတာ | Node.js 18+ တပ်ပြီး terminal အသစ်ဖွင့်ပါ |
| CSV download မဖြစ်ဘူး | Token မပါတာ သို့မဟုတ် export request မရောက်တာ | Login ပြန်လုပ်ပြီး [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) ထဲက curl ဥပမာနဲ့ စစ်ပါ |

## Zip လုပ်နည်း

Project root မှာ PowerShell နဲ့:

```powershell
./make-zip.ps1
```

`make-zip.ps1` က source တွေကို zip ထဲ ထည့်ပေးပါတယ်။ `node_modules`, `dist`, `build`, `.git`, `.env` နဲ့ `.log` file တွေကို ဖယ်ထားလို့ zip က သေးပြီး secret တွေ မပါပါဘူး။

## နောက်ထပ်ဖတ်ရမယ့်စာရွက်တွေ

- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) — endpoint အသေးစိတ်၊ response shape၊ status code၊ curl ဥပမာ
- [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) — file tree အပြည့်အစုံနဲ့ data flow ပုံ
- [BEGINNER_GUIDE.md](./BEGINNER_GUIDE.md) — request တစ်ခု ဘယ်လို စီးဆင်းသလဲ၊ ဘယ်ကနေ ဖတ်စတင်မလဲ
