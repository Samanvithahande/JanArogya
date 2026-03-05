# JanArogya 🏥
### AI-Powered Healthcare Assistant for Rural India

---

## 🎯 Goal

> **To bridge the healthcare gap in rural India by empowering patients with AI-driven tools that overcome language barriers, enable faster emergency response, and ensure proper medication adherence.**

JanArogya provides rural patients with three intelligent modules that deliver expert-level healthcare support in their native language — even in resource-constrained settings with limited specialist access.

---

## 🌟 The Problem

Rural healthcare in India faces critical challenges:

| Challenge | Impact |
|---|---|
| **Limited Specialist Access** | Rural patients lack immediate expert guidance during emergencies |
| **Language Barriers** | India's linguistic diversity leads to misdiagnosis and communication gaps |
| **Prescription Confusion** | Low literacy rates cause medication errors with handwritten prescriptions |
| **Emergency Response Delays** | The critical "golden hour" is wasted due to delayed severity assessment |
| **Medical Record Gaps** | Patients lack organized access to their consultation history |

These challenges result in delayed diagnoses, poor treatment adherence, and preventable deaths in emergency situations.

---

## 💡 Solution: Three AI-Powered Modules

### Module 1 — ET-AI Trauma Triage 🚨
**For**: Trauma and injury situations

```
Patient has injury
  → Opens JanArogya → Taps "Emergency Help"
  → Takes photo of injury → AI analyzes image
  → Receives severity score (1–10) with color coding
  → Gets immediate action steps
  → Shows nearest hospital/PHC
  → Emergency contacts ready to dial
```

**Technology**: Computer vision (Gemini 2.5 Flash) analyzes wounds, burns, fractures, and animal bites.

**Output**:
- Severity score with urgency level
- Prioritized immediate actions
- Resource recommendations
- Auto-alert for critical cases (≥ 7 severity)

---

### Module 2 — Polyglot Scribe 📋
**For**: Understanding past consultations and medical history

```
Doctor consultation happens → Audio recorded
  → AI transcribes in patient's language (11+ Indian languages)
  → Generates structured medical summary
  → Patient opens JanArogya → Views "My Records"
  → Reads/listens to summary in native language
  → Can share with other doctors or family
```

**Technology**: Speech-to-text with auto language detection, medical entity extraction, clinical summary generation.

**Output**:
- Chief complaint with duration
- Organized symptoms & medical history
- Examination findings
- Treatment plan & follow-up instructions
- Red flag warnings

---

### Module 3 — Rx-Vox 💊
**For**: Understanding and following medication instructions

```
Patient receives handwritten prescription
  → Opens JanArogya → Taps "Scan Prescription"
  → Takes photo → AI reads handwriting (OCR)
  → Extracts medicine details → Converts to audio instructions
  → Patient hears step-by-step guide in native language
  → Sets medication reminders → Gets refill alerts
```

**Technology**: OCR with medical handwriting recognition, text-to-speech in 11+ languages.

**Output**:
- Medicine names (brand + generic)
- Dosage, frequency, duration, and timing
- Special food-related instructions
- Audio playback in patient's language
- Automated reminders

---

## 🔄 Patient Journey Scenarios

### Scenario 1: Emergency Injury
```
Farmer cuts hand with farming tool
  → Opens JanArogya → Photographs wound
  → AI: "Severity 8/10 – Deep laceration, needs immediate stitches"
  → Action: "Apply pressure, elevate hand, go to PHC immediately"
  → Maps nearest PHC with directions
  → Calls ambulance if needed
  → Potentially saves hand from infection/disability
```

### Scenario 2: Post-Consultation Follow-up
```
Patient visits PHC with fever and cough
  → Doctor consultation recorded
  → JanArogya transcribes conversation (detected: Hindi)
  → Summary: "Viral fever, prescribed rest and paracetamol"
  → Patient listens to voice summary in Hindi at home
  → Gets reminder for follow-up in 3 days
```

### Scenario 3: Medication Adherence
```
Elderly patient receives prescription for diabetes
  → Can't read doctor's handwriting
  → Opens JanArogya → Scans prescription
  → AI reads: "Metformin 500mg, twice daily, before meals"
  → Hears audio in Telugu: "Ee mandu roju rendu sarlu, aahaaram mundu teesukovali"
  → Sets morning/evening reminders → Better diabetes management
```

---

## 📱 User Experience

### First Time User
```
Downloads JanArogya
  → Selects preferred language (visual icons)
  → Phone-based OTP registration
  → Optional voice-guided tutorial
  → Dashboard with 3 large visual cards:
     [📸 Emergency Help]  [📋 My Records]  [💊 My Medicines]
  → SOS button always visible
```

### Emergency User
```
Urgent situation
  → Opens app → One tap: "Emergency Assessment"
  → Camera opens automatically → Snap photo
  → Instant guidance → Hospital directions → Call ambulance
  → Life-saving response in < 2 minutes
```

---

## ♿ Accessibility Features

- **11+ Indian Languages** — Native language support across all modules
- **Voice Navigation** — For low-literacy users
- **Large Visual Icons** — Minimal text dependency
- **Offline Mode** — Critical features work without internet
- **Low Data Usage** — Optimized for 2G/3G networks

---

## 🔒 Privacy & Security

- Phone number-based authentication (OTP)
- End-to-end encrypted health records
- HIPAA-compliant data storage (Supabase)
- Patient-controlled data sharing
- Audit logs for compliance

---

## 🛠️ Technical Architecture

### Stack Overview

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript |
| **Styling** | Tailwind CSS + Shadcn/ui |
| **Offline** | Service Workers (PWA) |
| **Backend** | Supabase (PostgreSQL + Auth + Storage + Realtime) |
| **Auth** | Phone OTP with Row Level Security |
| **AI Model** | Google Gemini 2.5 Flash (Multimodal) |

### AI Capabilities

- **Vision API** — Trauma image analysis
- **Speech-to-Text** — Multilingual transcription
- **OCR** — Medical handwriting recognition
- **Text-to-Speech** — Native language audio generation

### Database Schema

```
├── users                  # Patient profiles, language preferences
├── emergency_assessments  # Trauma triage history
├── consultations          # Audio recordings, transcriptions
├── prescriptions          # Parsed medicine details
├── medications            # Reminder schedules
├── vitals                 # Health tracking data
└── audit_logs             # Compliance tracking
```

---

## 📊 Expected Impact

### Quantitative

| Metric | Improvement |
|---|---|
| Emergency severity assessment | **80% faster** |
| Medication adherence | **+40%** |
| Population coverage | **90%+** via multilingual support |
| Prescription misinterpretation | **60% reduction** |
| Consultation documentation time | **15–20 min saved** |

### Qualitative
- Reduced trauma mortality through faster golden hour decisions
- Bridged urban-rural healthcare gap
- Increased patient confidence in self-care
- Better treatment compliance through native language support
- Comprehensive digital health records for care continuity

---

## 🌍 Supported Languages

| Language | Script |
|---|---|
| Hindi | हिंदी |
| Tamil | தமிழ் |
| Telugu | తెలుగు |
| Malayalam | മലയാളം |
| Kannada | ಕನ್ನಡ |
| Bengali | বাংলা |
| Gujarati | ગુજરાતી |
| Marathi | मराठी |
| Punjabi | ਪੰਜਾਬੀ |
| Odia | ଓଡ଼ିଆ |
| English | English |

---

## 🚀 Getting Started

### For Patients
1. Visit [janarogya.health](https://janarogya.health) or download the app
2. Select your preferred language
3. Register with your phone number (OTP verification)
4. Complete your profile (name, age, village)
5. Start using Emergency Help, Records, or Prescriptions

### For Developers

```bash
# Clone repository
git clone https://github.com/Samanvithahande/JanArogya.git
cd JanArogya

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add Supabase credentials and Gemini API key

# Run development server
npm run dev
# Open http://localhost:3000
```

---

## 🤝 Contributing

We welcome contributions to make healthcare more accessible!  
See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for guidelines.

---

## 📄 License

[MIT License](./LICENSE)

---

## 🙏 Acknowledgments

Built to serve rural India's **65% population (900+ million people)** who face healthcare accessibility challenges every day.

---

<div align="center">

### JanArogya — जन आरोग्य — People's Health

*Making quality healthcare accessible to every Indian, in every language, in every village.*

</div>