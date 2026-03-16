export type AppLanguage = "en" | "hi" | "kn"

type TranslationEntry = {
  hi: string
  kn: string
}

const translations: Record<string, TranslationEntry> = {
  "Sign In": { hi: "साइन इन", kn: "ಸೈನ್ ಇನ್" },
  "Create Account": { hi: "खाता बनाएं", kn: "ಖಾತೆ ರಚಿಸಿ" },
  "Welcome Back": { hi: "वापसी पर स्वागत है", kn: "ಮತ್ತೆ ಸ್ವಾಗತ" },
  "Forgot password?": { hi: "पासवर्ड भूल गए?", kn: "ಪಾಸ್ವರ್ಡ್ ಮರೆತಿರಾ?" },
  "Email": { hi: "ईमेल", kn: "ಇಮೇಲ್" },
  "Password": { hi: "पासवर्ड", kn: "ಪಾಸ್ವರ್ಡ್" },
  "First Name": { hi: "पहला नाम", kn: "ಮೊದಲ ಹೆಸರು" },
  "Last Name": { hi: "उपनाम", kn: "ಕೊನೆಯ ಹೆಸರು" },
  "Your Area": { hi: "आपका क्षेत्र", kn: "ನಿಮ್ಮ ಪ್ರದೇಶ" },
  "Using As": { hi: "के रूप में उपयोग", kn: "ಈ ರೂಪದಲ್ಲಿ ಬಳಕೆ" },
  "Myself": { hi: "स्वयं", kn: "ನಾನು" },
  "Save Changes": { hi: "परिवर्तन सहेजें", kn: "ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ" },
  "Settings": { hi: "सेटिंग्स", kn: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು" },
  "Dashboard": { hi: "डैशबोर्ड", kn: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್" },
  "Injury Check": { hi: "चोट जांच", kn: "ಗಾಯ ಪರಿಶೀಲನೆ" },
  "Health Notes": { hi: "स्वास्थ्य नोट्स", kn: "ಆರೋಗ್ಯ ಟಿಪ್ಪಣಿಗಳು" },
  "Medicine Voice": { hi: "दवा आवाज", kn: "ಔಷಧ ಧ್ವನಿ" },
  "History": { hi: "इतिहास", kn: "ಇತಿಹಾಸ" },
  "Emergency": { hi: "आपातकाल", kn: "ತುರ್ತು" },
  "Reports": { hi: "रिपोर्ट्स", kn: "ವರದಿಗಳು" },
  "Personal Insights": { hi: "व्यक्तिगत जानकारी", kn: "ವೈಯಕ್ತಿಕ ಒಳನೋಟಗಳು" },
  "Live Health Help": { hi: "लाइव स्वास्थ्य सहायता", kn: "ಲೈವ್ ಆರೋಗ್ಯ ಸಹಾಯ" },
  "Notifications": { hi: "सूचनाएं", kn: "ಅಧಿಸೂಚನೆಗಳು" },
  "3 new": { hi: "3 नई", kn: "3 ಹೊಸದು" },
  "Urgent Injury Alert": { hi: "तत्काल चोट अलर्ट", kn: "ತುರ್ತು ಗಾಯ ಎಚ್ಚರಿಕೆ" },
  "Health Notes Ready": { hi: "स्वास्थ्य नोट्स तैयार", kn: "ಆರೋಗ್ಯ ಟಿಪ್ಪಣಿಗಳು ಸಿದ್ಧ" },
  "Rx Processed": { hi: "Rx प्रोसेस हुआ", kn: "Rx ಪ್ರಕ್ರಿಯೆ ಪೂರ್ಣ" },
  "Good morning, Rajan. Your personal health dashboard is ready.": { hi: "सुप्रभात, राजन। आपका व्यक्तिगत स्वास्थ्य डैशबोर्ड तैयार है।", kn: "ಶುಭೋದಯ, ರಾಜನ್. ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ಆರೋಗ್ಯ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಸಿದ್ಧವಾಗಿದೆ." },
  "Open Emergency Help": { hi: "आपात सहायता खोलें", kn: "ತುರ್ತು ಸಹಾಯ ತೆರೆಯಿರಿ" },
  "Review Saved History": { hi: "सहेजा इतिहास देखें", kn: "ಉಳಿಸಿದ ಇತಿಹಾಸ ನೋಡಿ" },
  "Open Module": { hi: "मॉड्यूल खोलें", kn: "ಮಾಡ್ಯೂಲ್ ತೆರೆಯಿರಿ" },
  "Live Help Queue": { hi: "लाइव सहायता कतार", kn: "ಲೈವ್ ಸಹಾಯ ಸರದಿ" },
  "Person": { hi: "व्यक्ति", kn: "ವ್ಯಕ್ತಿ" },
  "Severity": { hi: "गंभीरता", kn: "ತೀವ್ರತೆ" },
  "Updated": { hi: "अपडेट", kn: "ನವೀಕರಿಸಲಾಗಿದೆ" },
  "Priority Shortcuts": { hi: "प्राथमिक शॉर्टकट", kn: "ಪ್ರಾಥಮ್ಯ ಶಾರ್ಟ್‌ಕಟ್‌ಗಳು" },
  "Emergency Panel": { hi: "आपात पैनल", kn: "ತುರ್ತು ಫಲಕ" },
  "Daily Personal Reports": { hi: "दैनिक व्यक्तिगत रिपोर्ट", kn: "ದೈನಂದಿನ ವೈಯಕ್ತಿಕ ವರದಿಗಳು" },
  "Personal Settings": { hi: "व्यक्तिगत सेटिंग्स", kn: "ವೈಯಕ್ತಿಕ ಸೆಟ್ಟಿಂಗ್‌ಗಳು" },
  "Personal Health Tools": { hi: "व्यक्तिगत स्वास्थ्य टूल्स", kn: "ವೈಯಕ್ತಿಕ ಆರೋಗ್ಯ ಸಾಧನಗಳು" },
  "Operations": { hi: "संचालन", kn: "ಕಾರ್ಯಾಚರಣೆಗಳು" },
  "Personal Account": { hi: "व्यक्तिगत खाता", kn: "ವೈಯಕ್ತಿಕ ಖಾತೆ" },
  "Sign Out": { hi: "साइन आउट", kn: "ಸೈನ್ ಔಟ್" },
  "Image Upload": { hi: "छवि अपलोड", kn: "ಚಿತ್ರ ಅಪ್‌ಲೋಡ್" },
  "Check Injury": { hi: "चोट जांचें", kn: "ಗಾಯ ಪರಿಶೀಲಿಸಿ" },
  "Immediate Safety Steps": { hi: "तत्काल सुरक्षा कदम", kn: "ತಕ್ಷಣದ ಸುರಕ್ಷತಾ ಕ್ರಮಗಳು" },
  "Helpful Items": { hi: "उपयोगी सामग्री", kn: "ಉಪಯುಕ್ತ ವಸ್ತುಗಳು" },
  "Call Emergency Help": { hi: "आपात सहायता कॉल करें", kn: "ತುರ್ತು ಸಹಾಯಕ್ಕೆ ಕರೆ ಮಾಡಿ" },
  "Audio Input": { hi: "ऑडियो इनपुट", kn: "ಆಡಿಯೋ ಇನ್‌ಪುಟ್" },
  "Medical Summary": { hi: "स्वास्थ्य सारांश", kn: "ಆರೋಗ್ಯ ಸಾರಾಂಶ" },
  "Main Issue": { hi: "मुख्य समस्या", kn: "ಮುಖ್ಯ ಸಮಸ್ಯೆ" },
  "Symptoms": { hi: "लक्षण", kn: "ಲಕ್ಷಣಗಳು" },
  "Risk Notes": { hi: "जोखिम नोट्स", kn: "ಅಪಾಯ ಟಿಪ್ಪಣಿಗಳು" },
  "Care Plan": { hi: "देखभाल योजना", kn: "ಪಾಲನಾ ಯೋಜನೆ" },
  "Next Steps": { hi: "अगले कदम", kn: "ಮುಂದಿನ ಹೆಜ್ಜೆಗಳು" },
  "Upload Audio File": { hi: "ऑडियो फ़ाइल अपलोड करें", kn: "ಆಡಿಯೋ ಫೈಲ್ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ" },
  "Prescription Upload": { hi: "पर्ची अपलोड", kn: "ಪ್ರಿಸ್ಕ್ರಿಪ್ಶನ್ ಅಪ್‌ಲೋಡ್" },
  "Upload Prescription": { hi: "पर्ची अपलोड करें", kn: "ಪ್ರಿಸ್ಕ್ರಿಪ್ಶನ್ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ" },
  "Audio Language": { hi: "ऑडियो भाषा", kn: "ಆಡಿಯೋ ಭಾಷೆ" },
  "Extracted Medicines": { hi: "निकाली गई दवाएं", kn: "ತೆಗೆದ ಔಷಧಿಗಳು" },
  "Medicine": { hi: "दवा", kn: "ಔಷಧ" },
  "Dosage": { hi: "खुराक", kn: "ಡೋಸ್" },
  "Frequency": { hi: "बारंबारता", kn: "ಆವೃತ್ತಿ" },
  "Duration": { hi: "अवधि", kn: "ಅವಧಿ" },
  "Audio": { hi: "ऑडियो", kn: "ಆಡಿಯೋ" },
  "Play": { hi: "चलाएं", kn: "ಪ್ಲೇ" },
  "Playing...": { hi: "चल रहा है...", kn: "ಪ್ಲೇ ಆಗುತ್ತಿದೆ..." },
  "Emergency Help Contacts": { hi: "आपात सहायता संपर्क", kn: "ತುರ್ತು ಸಹಾಯ ಸಂಪರ್ಕಗಳು" },
  "Emergency Services": { hi: "आपात सेवाएं", kn: "ತುರ್ತು ಸೇವೆಗಳು" },
  "Nearby Hospitals": { hi: "नजदीकी अस्पताल", kn: "ಹತ್ತಿರದ ಆಸ್ಪತ್ರೆಗಳು" },
  "Helplines": { hi: "हेल्पलाइन", kn: "ಸಹಾಯವಾಣಿ" },
  "Call": { hi: "कॉल", kn: "ಕಾಲ್" },
  "View Archive": { hi: "आर्काइव देखें", kn: "ಆರ್ಕೈವ್ ನೋಡಿ" },
  "Filter": { hi: "फ़िल्टर", kn: "ಫಿಲ್ಟರ್" },
  "Action": { hi: "क्रिया", kn: "ಕ್ರಿಯೆ" },
  "Generated": { hi: "जनरेटेड", kn: "ರಚಿಸಲಾಗಿದೆ" },
  "Pending": { hi: "लंबित", kn: "ಬಾಕಿ" },
  "Profile": { hi: "प्रोफ़ाइल", kn: "ಪ್ರೊಫೈಲ್" },
  "Preferences": { hi: "प्राथमिकताएं", kn: "ಆದ್ಯತೆಗಳು" },
  "Default Language": { hi: "डिफ़ॉल्ट भाषा", kn: "ಡೀಫಾಲ್ಟ್ ಭಾಷೆ" },
  "Emergency Alerts": { hi: "आपात अलर्ट", kn: "ತುರ್ತು ಎಚ್ಚರಿಕೆಗಳು" },
  "Auto-translate Summaries": { hi: "सारांश स्वत: अनुवाद", kn: "ಸಾರಾಂಶ ಸ್ವಯಂ ಅನುವಾದ" },
  "Audio Auto-play": { hi: "ऑडियो ऑटो-प्ले", kn: "ಆಡಿಯೋ ಸ್ವಯಂ-ಪ್ಲೇ" },
  "Launch Dashboard": { hi: "डैशबोर्ड खोलें", kn: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ತೆರೆಯಿರಿ" },
  "Explore Modules": { hi: "मॉड्यूल देखें", kn: "ಮಾಡ್ಯೂಲ್‌ಗಳನ್ನು ಅನ್ವೇಷಿಸಿ" },
  "Features": { hi: "विशेषताएं", kn: "ವೈಶಿಷ್ಟ್ಯಗಳು" },
  "Workflow": { hi: "कार्यप्रवाह", kn: "ಕಾರ್ಯಪ್ರವಾಹ" },
  "Impact": { hi: "प्रभाव", kn: "ಪ್ರಭಾವ" },
  "Get Started": { hi: "शुरू करें", kn: "ಪ್ರಾರಂಭಿಸಿ" },
  "Start Free": { hi: "फ्री शुरू करें", kn: "ಉಚಿತವಾಗಿ ಪ್ರಾರಂಭಿಸಿ" },
}

export function getTextCore(text: string): { leading: string; core: string; trailing: string } {
  const match = text.match(/^(\s*)([\s\S]*?)(\s*)$/)
  if (!match) {
    return { leading: "", core: text, trailing: "" }
  }

  const [, leading, core, trailing] = match
  return { leading, core, trailing }
}

export function getDictionaryTranslation(text: string, language: AppLanguage): string | null {
  if (language === "en") return text
  const item = translations[text]
  if (!item) return null
  return language === "hi" ? item.hi : item.kn
}

export function translateTextPreservingWhitespace(
  text: string,
  language: AppLanguage,
  runtimeTranslations?: Record<string, string>
): string {
  if (!text) return text

  const { leading, core, trailing } = getTextCore(text)
  if (!core) return text

  if (language === "en") return `${leading}${core}${trailing}`

  const dictionary = getDictionaryTranslation(core, language)
  const runtime = runtimeTranslations?.[core]
  const translated = dictionary ?? runtime

  if (!translated) return text
  return `${leading}${translated}${trailing}`
}
