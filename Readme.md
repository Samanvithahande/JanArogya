# JanArogya — User Flow Diagram 🏥

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
              │  • Enter phone number     │
              │  • Select language        │
              │    (Hindi / Tamil /       │
              │     Telugu / etc.)        │
              └───────────────────────────┘
                              │
                              ▼
              ┌───────────────────────────┐
              │   📱 OTP VERIFICATION     │
              │  • 6-digit OTP via SMS    │
              │  • Enter code in app      │
              └───────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
               OTP Valid?          OTP Invalid?
                    │                   │
                    ▼                   ▼
               ✅ Proceed         ┌──────────────┐
                                  │ ❌ Error Msg  │
                                  │ Resend OTP   │
                                  │ (retry)      │
                                  └──────┬───────┘
                                         │
                                    loops back up
```

---

```
┌─────────────────────────────────────────────────────────────┐
│                   PHASE 2 — PROFILE SETUP                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
              ┌───────────────────────────┐
              │     👤 COMPLETE PROFILE   │
              │  • Name, Age              │
              │  • Village / District     │
              │  • Emergency contact      │
              │  • Add family members     │
              │    (optional)             │
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
              │  • Enter phone number     │
              │  • OTP sent again         │
              │  • Confirm & enter app    │
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
Register (Phone + Language)
     │
     ▼
OTP Verification ──❌──► Resend OTP ──► (retry)
     │ ✅
     ▼
Complete Profile
     │
     ▼
Voice Tutorial (optional)
     │
     ▼  ◄──────────────────────────── Returning User: Login via OTP
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
| OTP Valid? | Proceed to profile setup | Show error, offer resend |
| New user? | Register → Setup → Dashboard | Login → Dashboard directly |
| Severity ≥ 7? | Auto-alert + ambulance prompt | Show self-care steps |
| Internet available? | Full AI features | Offline mode (critical features) |
| Literacy level? | Text + voice | Voice-only navigation |

---

## Returning User Flow

```
Opens App
     │
     ▼
Login Page (phone number)
     │
     ▼
OTP Sent → Verified
     │
     ▼
Dashboard → Pick module or check notifications
```

---

*JanArogya — जन आरोग्य — People's Health*