# JanArogya — User Flow Diagram 🏥

## Supabase Email Auth Setup

1. Create a Supabase project.
2. In Supabase Dashboard, go to `Authentication -> URL Configuration` and set:
     - `Site URL`: `http://localhost:3000`
     - `Redirect URLs`: `http://localhost:3000/login`
3. Copy `.env.example` to `.env.local` and set:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `BACKEND_URL` (required in production)
4. In Supabase Dashboard, go to `Authentication -> Providers -> Email` and keep Email provider enabled.
5. Start app with `npm run dev`.

## Deployment Environment Variables

Set these in your hosting provider (for example Vercel Project Settings -> Environment Variables):

- `BACKEND_URL`: Base URL of the deployed Python backend (recommended).
- `NEXT_PUBLIC_API_URL`: Optional client fallback for direct backend calls.
- `NEXT_PUBLIC_API_BASE`: Keep `/api` to use Next route handlers, or set an absolute backend URL.

Set this in your Python backend host (for example Render Environment):

- `FRONTEND_ORIGINS`: Comma-separated allowed origins, for example `https://janarogya.vercel.app,https://<preview>.vercel.app`

Without a backend URL, upload-based modules (`Injury Check`, `Rx-Vox`, `Scribe`) will return a 500 error in production.

Current auth behavior in this repo:
- `Register` uses Supabase email/password sign-up and stores basic profile metadata.
- If email confirmation is enabled, user sees a "check your email" message after sign-up.
- `Login` uses Supabase email/password sign-in.
- All `/dashboard/*` routes are server-protected and redirect unauthenticated users to `/login`.
- Sidebar `Sign Out` performs Supabase sign-out and returns to login.

---

## Complete User Journey

```
┌─────────────────────────────────────────────────────────────┐
│                        USER ENTRY                           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
              ┌───────────────────────────┐
              │        🌐 LANDING PAGE    │
              │  • See app in own language│
              │  • Understand 3 modules   │
              │  • Tap "Get Started"      │
              └───────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     PHASE 1 — REGISTER                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
              ┌───────────────────────────┐
              │     📝 REGISTER PAGE      │
              │  • Full Name              │
              │  • Age / Date of Birth    │
              │  • Gender                 │
              │  • Village / District     │
              │  • State                  │
              │  • Phone Number           │
              │  • Email Address          │
              │  • Password               │
              │  • Emergency Contact      │
              │    (name + phone)         │
              │  • Select language        │
              │    (Hindi / Tamil /       │
              │     Telugu / etc.)        │
              │  • Add family members     │
              │    (optional)             │
              └───────────────────────────┘
                              │
                              ▼
              ┌───────────────────────────┐
              │   📧 EMAIL VERIFICATION   │
              │  • Verification link sent │
              │    to registered email    │
              │  • Click link to confirm  │
              │    account                │
              └───────────────────────────┘
                              │
                    ┌─────────┴──────────────┐
                    │                        │
             Link Clicked?          Link Not Clicked?
                    │                        │
                    ▼                        ▼
               ✅ Proceed          ┌─────────────────┐
                                   │ ❌ Email not     │
                                   │   verified       │
                                   │ Resend email     │
                                   │ (retry)          │
                                   └────────┬─────────┘
                                            │
                                       loops back up
```

---

```
┌─────────────────────────────────────────────────────────────┐
│                   PHASE 2 — ONBOARDING                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
              ┌───────────────────────────┐
              │   ✅ ACCOUNT CONFIRMED    │
              │  • Email verified         │
              │  • Profile already filled │
              │    during registration    │
              │  • Review & confirm       │
              │    submitted details      │
              └───────────────────────────┘
                              │
                              ▼
              ┌───────────────────────────┐
              │   🎙️ VOICE TUTORIAL       │
              │     (optional)            │
              │  • Step-by-step walkthru  │
              │  • In user's own language │
              │  • Recommended for low-   │
              │    literacy users         │
              └───────────────────────────┘
```

---

```
┌─────────────────────────────────────────────────────────────┐
│                    PHASE 3 — LOGIN                          │
│               (Returning Users Enter Here)                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
              ┌───────────────────────────┐
              │       🔐 LOGIN PAGE       │
              │  • Enter email address    │
              │  • Enter password         │
              │  • Forgot password?       │
              │    (reset via email link) │
              └───────────────────────────┘
```

---

```
┌─────────────────────────────────────────────────────────────┐
│                   PHASE 4 — DASHBOARD                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │            🏠 MAIN DASHBOARD            │
        │                                         │
        │   ┌───────────┐  ┌───────────┐          │
        │   │📸 Emergency│  │📋 My      │          │
        │   │   Help    │  │ Records   │          │
        │   └───────────┘  └───────────┘          │
        │          ┌───────────┐                  │
        │          │💊 My      │                  │
        │          │ Medicines │                  │
        │          └───────────┘                  │
        │                                         │
        │   🔴 SOS Button — always visible        │
        │   🔔 Medication reminders shown here    │
        └─────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
              ▼               ▼               ▼
```

---

```
┌─────────────────────────────────────────────────────────────┐
│              PHASE 5 — CHOOSE A MODULE                      │
└─────────────────────────────────────────────────────────────┘

   MODULE A              MODULE B              MODULE C
┌────────────────┐   ┌────────────────┐   ┌────────────────┐
│ 🚨 ET-AI TRIAGE│   │📋 POLYGLOT     │   │💊 RX-VOX       │
│  (Emergency)   │   │   SCRIBE       │   │ (Prescription) │
│                │   │  (Records)     │   │                │
│ 1. Tap         │   │ 1. Record      │   │ 1. Scan        │
│    Emergency   │   │    consult     │   │    prescription│
│    Help        │   │    audio       │   │    photo       │
│                │   │                │   │                │
│ 2. Photo of    │   │ 2. AI detects  │   │ 2. AI reads    │
│    injury      │   │    language    │   │    handwriting │
│                │   │    & trans-    │   │    (OCR)       │
│ 3. AI scores   │   │    cribes      │   │                │
│    severity    │   │                │   │ 3. Extracts    │
│    (1–10)      │   │ 3. Structured  │   │    medicine,   │
│                │   │    summary     │   │    dose, timing│
│ 4. Action      │   │    generated   │   │                │
│    steps shown │   │                │   │ 4. Audio guide │
│                │   │ 4. Patient     │   │    in native   │
│ 5. Nearest     │   │    reads or    │   │    language    │
│    PHC / hosp. │   │    listens in  │   │                │
│    on map      │   │    own lang.   │   │ 5. Set daily   │
│                │   │                │   │    reminders   │
│ 6. Call        │   │ 5. Share with  │   │                │
│    ambulance   │   │    doctor /    │   │ 6. Refill      │
│    if critical │   │    family      │   │    alerts      │
└────────────────┘   └────────────────┘   └────────────────┘
        │                   │                    │
        └───────────────────┴────────────────────┘
                              │
                              ▼
```

---

```
┌─────────────────────────────────────────────────────────────┐
│                  PHASE 6 — ONGOING USE                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
              ┌───────────────────────────┐
              │  🔔 DAILY REMINDERS       │
              │  • Morning / evening meds │
              │  • Follow-up visit alerts │
              │  • Refill notifications   │
              └───────────────────────────┘
                              │
                              ▼
              ┌───────────────────────────┐
              │  📁 HEALTH HISTORY GROWS  │
              │  • Past assessments saved │
              │  • All prescriptions      │
              │  • Consultation records   │
              │  • Share with any doctor  │
              └───────────────────────────┘
                              │
                              ▼
              ┌───────────────────────────┐
              │  ✅ BETTER HEALTH         │
              │     OUTCOMES              │
              │  • Informed patient       │
              │  • Medicine adherence     │
              │  • Emergency handled fast │
              │  • Healthcare gap bridged │
              └───────────────────────────┘
```

---

## Full Flow at a Glance

```
Landing Page
     │
     ▼
Register (Name, Age, Gender, Village, Email, Password, Phone, Emergency Contact, Language)
     │
     ▼
Email Verification ──❌──► Resend Email ──► (retry)
     │ ✅
     ▼
Review Confirmed Profile
     │
     ▼
Voice Tutorial (optional)
     │
     ▼  ◄──────────────────────────── Returning User: Login via Email + Password
     │
     ▼
Dashboard  [📸 Emergency]  [📋 Records]  [💊 Medicines]  [🔴 SOS]
     │
     ├──────────────────┬──────────────────┐
     ▼                  ▼                  ▼
ET-AI Triage     Polyglot Scribe        Rx-Vox
(Photo → Score   (Audio → Summary   (Scan Rx → Audio
 → Hospital)      → Native Lang.)    → Reminders)
     │                  │                  │
     └──────────────────┴──────────────────┘
                        │
                        ▼
               Daily Reminders & Alerts
                        │
                        ▼
              Health History Builds Up
                        │
                        ▼
             ✅ Better Health Outcomes
```

---

## Decision Points Summary

| Decision | Yes Path | No Path |
|---|---|---|
| Email Verified? | Proceed to onboarding | Show error, offer resend email |
| New user? | Register (with profile) → Verify Email → Dashboard | Login (email + password) → Dashboard directly |
| Severity ≥ 7? | Auto-alert + ambulance prompt | Show self-care steps |
| Internet available? | Full AI features | Offline mode (critical features) |
| Literacy level? | Text + voice | Voice-only navigation |

---

## Returning User Flow

```
Opens App
     │
     ▼
Login Page (email + password)
     │
     ▼
Credentials Verified
     │
     ▼
Dashboard → Pick module or check notifications
```

---

*JanArogya — जन आरोग्य — People's Health*