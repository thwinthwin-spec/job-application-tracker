# Beginner Guide

ဒီစာရွက်က React/Vite နဲ့ Express/MongoDB ကို အသစ်စတင်သုံးတဲ့သူအတွက် ရေးထားတာပါ။ ရည်ရွယ်ချက်က **"Application အသစ်တစ်ခု ဖန်တီးတဲ့ request တစ်ခု ဘယ်ကနေ ဘယ်ကို ရောက်သလဲ"** ဆိုတာကို တစ်ဆင့်ချင်း နားလည်စေဖို့ပါ။ English technical term တွေကို မူရင်းအတိုင်း ထားပြီး ရှင်းလင်းချက်က မြန်မာလို ဖြစ်ပါတယ်။

## 1. အခြေခံ စကားလုံးလေးတွေ

| Term | ရှင်းလင်းချက် | ဥပမာ |
| --- | --- | --- |
| `useState` | ပြောင်းလဲနေတဲ့ တန်ဖိုး သိမ်းဖို့။ ပြောင်းရင် UI ပြန်ဆွဲတယ်။ | `const [jobTitle, setJobTitle] = useState("")` |
| `useEffect` | Page ပေါ်လာတဲ့အခါ သို့မဟုတ် state ပြောင်းတဲ့အခါ အလုပ်လုပ်ဖို့။ | `useEffect(() => load(), [page])` |
| `req` | Client က ပို့လာတဲ့ request။ | `req.body`, `req.params.id`, `req.user.id` |
| `res` | Server က ပြန်ပေးတဲ့ response။ | `res.status(201).json(...)` |

`req.query` က `?status=Applied` လို query string တန်ဖိုးတွေ ဖြစ်ပါတယ်။ `req.user` ကတော့ auth middleware က ထည့်ပေးတဲ့ login ထားသူအချက်အလက်။ Client နဲ့ server ပြောဆိုတဲ့ JSON က ဒီလိုပုံစံပါ။

```json
{ "jobTitle": "Frontend Developer", "status": "Applied" }
```

`useState` ကို form မှာ အခုလို သုံးတယ်။ `setForm(...)` ခေါ်တိုင်း တန်ဖိုးအသစ် သိမ်းပြီး React က ပြန်ဆွဲပေးတယ်။

```jsx
const [form, setForm] = useState({ jobTitle: "", company: "", status: "Saved" });
```

`useEffect` ကို စာရင်းယူဖို့ အခုလို သုံးတယ်။ `page` သို့မဟုတ် `status` ပြောင်းရင် `loadApplications()` ပြန်အလုပ်လုပ်တယ်။

```jsx
useEffect(() => { loadApplications(); }, [page, status]);
```

## 2. ဘယ်ကနေ ဖတ်စတင်မလဲ

အောက်အစဉ်အတိုင်း ဖတ်ရင် ရှုပ်မသွားပါဘူး။ တစ်ခါတည်း မဖတ်ပါနဲ့ — အောက်က flow ကို လိုက်ရင်း လိုအပ်တဲ့ဖိုင်ကိုပဲ ဖွင့်ပါ။

1. [README.md](./README.md) — project က ဘာလုပ်တလဲ၊ ဘယ်လို run လဲ
2. [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) — ဖိုင်တွေ ဘယ်နေရာမှာ ရှိလဲ
3. `client/src/utils/constants.js` — status နဲ့ employment type တန်ဖိုးတွေ
4. `client/src/pages/ApplicationFormPage.jsx` — form ဘယ်လိုဆောက်လဲ
5. `client/src/api/applicationApi.js` — API ခေါ်တဲ့ function
6. `server/src/routes/application.routes.js` — URL ကို controller နဲ့ ချိတ်ပုံ
7. `server/src/controllers/application.controller.js` — အဓိက logic
8. `server/src/models/Application.js` — MongoDB ထဲက data ပုံစံ
9. [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) — နောက်ဆုံးမှာ endpoint အသေးစိတ် ပြန်ကြည့်

## 3. "Create application" request တစ်ခုရဲ့ ခရီးစဉ်

User က form ဖြည့်ပြီး **Save** ကို နှိပ်လိုက်တယ်လို့ မြင်ယောင်ကြည့်ပါ။

```text
ApplicationFormPage.jsx
  -> applicationApi.js
  -> axios.js
  -> application.routes.js
  -> middleware/auth.js + validate.js
  -> application.controller.js
  -> Application.js (Mongoose model)
  -> MongoDB
  -> apiResponse.js
  -> Browser UI update
```

### အဆင့် 1 — Page မှာ form ရှိတယ်

`client/src/pages/ApplicationFormPage.jsx` မှာ field တွေက `useState` နဲ့ သိမ်းထားတယ်။ `onChange` ဖြစ်တိုင်း `setForm(...)` နဲ့ အသစ်ပြန်သိမ်းတယ်။ Submit လုပ်တဲ့အခါ `form` တစ်ခုလုံးကို api helper ဆီ ပို့ပါတယ်။

```jsx
await createApplication(form);
```

### အဆင့် 2 — API helper က ခေါ်ပေးတယ်

`client/src/api/applicationApi.js` က page နဲ့ axios ကြားက လက်ကိုင်တုတ်လိုပါပဲ။

```js
export const createApplication = (data) => api.post("/applications", data);
```

BaseURL က `http://localhost:5001/api` ဖြစ်တော့ တကယ့် URL က `http://localhost:5001/api/applications` ဖြစ်ပါတယ်။

### အဆင့် 3 — axios က token ထည့်ပေးတယ်

`client/src/api/axios.js` မှာ request interceptor ရှိပါတယ်။ Login ပြီး သိမ်းထားတဲ့ token ကို အလိုအလျောက် ဒီလို ထည့်ပေးတယ်။

```http
Authorization: Bearer <token>
```

ဒါကြောင့် page တိုင်းမှာ header ကို ထပ်ရေးစရာ မလိုပါဘူး။

### အဆင့် 4 — Route က လမ်းပြပေးတယ်

`server/src/routes/application.routes.js` ထဲက ဒီတန်းက အဓိကပါ။

```js
router.post("/", auth, validateApplication, createApplication);
```

`POST /api/applications` လာရင် အရင် `auth` က token စစ်, ပြီးရင် `validateApplication` က data စစ်, နောက်ဆုံးမှာ controller ကို အလုပ်လုပ်စေတယ်။

### အဆင့် 5 — Middleware နှစ်ခုက အစောင့်လုပ်တယ်

`server/src/middleware/auth.js` က token ကို JWT verify လုပ်ပြီး မှန်ရင် `req.user.id` ထည့်ပေးတယ်။ မမှန်ရင် `401` ပြန်ပြီး ဒီမှာပဲ ရပ်သွားတယ်။

`server/src/middleware/validate.js` က `jobTitle`, `company` ရှိ/မရှိ, `status` က enum ထဲမှာ ရှိ/မရှိ, date ပုံစံ မှန်/မမှန် စစ်တယ်။ မှားရင် `400` ပြန်တယ်။

### အဆင့် 6 — Controller က အဓိက အလုပ်လုပ်တယ်

`server/src/controllers/application.controller.js` ထဲက အဓိက လုပ်ချက်။

```js
const application = await Application.create({ ...req.body, owner: req.user.id });
```

**အရေးကြီးတာက** `owner` ကို client က မပို့စေဘဲ server က token ထဲက user id နဲ့ သတ်မှတ်တာပါ။ ဒါကြောင့် တခြားသူနာမည်နဲ့ application ဖန်တီးလို့ မရပါဘူး။

### အဆင့် 7 — Model က MongoDB နဲ့ ဆက်သွယ်ပေးတယ်

`server/src/models/Application.js` က JavaScript object ကို MongoDB document အဖြစ် ပြောင်းပေးတယ်။ Schema ထဲမှာ required, enum, ref, index တွေ ပါတယ်။

```text
Application.create({...})  ->  MongoDB insertOne()
```

MongoDB ထဲမှာ `owner`, `jobTitle`, `company`, `status`, `dateApplied`, `followUpDate` စတာတွေ သိမ်းပါတယ်။

### အဆင့် 8 — Response ပြန်လာတယ်

`server/src/utils/apiResponse.js` က အောင်မြင်ရင် `201` နဲ့ ဒီပုံစံ ပြန်ပေးတယ်။

```json
{ "success": true, "message": "Application created", "data": { "application": { "_id": "...", "jobTitle": "Frontend Developer" } } }
```

Client က ဒီ response ကို လက်ခံပြီး form ပိတ်/ရှင်းပေး, စာရင်းကို ပြန်ဆွဲပေး လုပ်ပါတယ်။

## 4. စာရင်းဖတ်တဲ့ flow နည်းနည်း

`client/src/pages/ApplicationListPage.jsx` မှာ `useEffect` ရှိပါတယ်။

```text
page ပေါ်လာ / filter ပြောင်း -> useEffect() -> getApplications({ status, page })
  -> GET /api/applications?status=Applied&page=1
  -> controller: find({ owner: req.user.id, status: "Applied" })
  -> { items, page, pages, total } -> ApplicationTable + Pagination ပြ
```

ဒီနေရာမှာလည်း `owner: req.user.id` ပါနေတာ သတိပြုပါ။ ဒါကြောင့် ကိုယ့်ရဲ့ စာရင်းပဲ မြင်ရတာပါ။

## 5. Ownership check ဘယ်လိုလုပ်လဲ

Application ၁ ခုကို ကြည့်/ပြင်/ဖျက် လုပ်တဲ့အခါ controller က ဒီလို ရှာပါတယ်။

```js
const application = await Application.findOne({ _id: req.params.id, owner: req.user.id });
```

query ထဲမှာ အခြေခံအချက် ၂ ခု ပါတယ် — `_id` က တောင်းထားတဲ့ application နဲ့ ကိုက်ရမယ်, `owner` က လက်ရှိ login ထားသူနဲ့ ကိုက်ရမယ်။ နှစ်ခုလုံး ကိုက်မှ တွေ့တာဖြစ်ပါတယ်။

| အခြေအနေ | ပြန်လာတာ |
| --- | --- |
| ကိုယ့် application | `200` နဲ့ data |
| မရှိတဲ့ id | `404 Not Found` |
| တခြားသူရဲ့ application id | `404 Not Found` |
| Token မပါ / ကုန်ပြီ | `401 Unauthorized` |

တခြားသူရဲ့ id ဆိုရင် `403` မပြဘဲ `404` ပြတာက **အဲဒီ id ရှိနေတယ်ဆိုတာတောင် မပြောချင်လို့** ဖြစ်ပါတယ်။ Delete မလုပ်ခင်မှာ `client/src/components/ConfirmDialog.jsx` က ထပ်မေးပေမယ့် နောက်ဆုံး စစ်ဆေးချက်ကတော့ server ဘက်က `owner` query ပါပဲ။

## 6. Error တွေ ဘယ်က ပြန်လာသလဲ

| Error အမျိုးအစား | စတင်တဲ့ဖိုင် | Code |
| --- | --- | --- |
| Token မရှိ/မှား | `server/src/middleware/auth.js` | `401` |
| Field မပြည့် / enum မှား | `server/src/middleware/validate.js` | `400` |
| Email duplicate | `server/src/controllers/auth.controller.js` | `409` |
| ID မတွေ့ / ပိုင်ရှင်မကိုက် | `server/src/controllers/application.controller.js` | `404` |
| Route မရှိ | `server/src/middleware/notFound.js` | `404` |
| မမျှော်လင့်တဲ့ error | `server/src/middleware/errorHandler.js` | `500` |

အားလုံးက `{ success: false, message, errors? }` ပုံစံနဲ့ ပြန်ပါတယ်။ Client က `client/src/components/ErrorMessage.jsx` နဲ့ ဖတ်ရလွယ်အောင် ပြပေးတယ်။

## 7. ကိုယ်တိုင် စမ်းကြည့်ရန်

`npm run seed` လုပ်ပြီး `npm run dev:server` နဲ့ `npm run dev:client` ကို terminal ၂ ခုမှာ ဖွင့်ပါ။ `demo@jobtracker.test` / `Demo@123` နဲ့ login လုပ်ပြီး application အသစ်ဖန်တီးကာ Developer Tools → Network ထဲက `POST /api/applications` ကို ရှာကြည့်ပါ။ Header ထဲမှာ `Authorization`, payload ထဲမှာ form data, response ထဲမှာ `success: true` တွေ့ရပါမယ်။

ပြီးရင် `other@jobtracker.test` / `Other@123` နဲ့ ပြောင်း login လုပ်ပြီး ပထမ account ရဲ့ application id ကို တိုက်ရိုက်ဖွင့်ကြည့်ပါ — `404` တက်ရပါမယ်။

## 8. အကျဉ်းချုပ်

- **Page** က user လုပ်ဆောင်ချက်ကို ဖမ်းပြီး state ထဲ သိမ်းတယ်။
- **API helper + axios** က base URL နဲ့ token ကို တစ်နေရာတည်းက စီမံပေးတယ်။
- **Route** က URL ကို မှန်တဲ့ controller ဆီ ပို့ပေးတယ်။
- **Middleware** က token နဲ့ data ကို အရင် စစ်ပေးတယ်။
- **Controller** က business logic — အထူးသဖြင့် `owner` သတ်မှတ်တာနဲ့ ownership check။
- **Model + MongoDB** က data ကို အမြဲတမ်း သိမ်းပေးတယ်။
- **Response helper** က အားလုံးကို တူညီတဲ့ JSON ပုံစံနဲ့ ပြန်ပေးတယ်။

နောက်ထပ် အသေးစိတ်လိုရင် [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) နဲ့ [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) ကို ပြန်ဖတ်ပါ။
