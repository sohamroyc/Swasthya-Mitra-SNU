/**
 * Swasthya Mitra — Local Knowledge Engine (localEngine.js)
 * ======================================================
 * Place at: src/services/localEngine.js
 *
 * This engine works 100% OFFLINE — no Gemini API key needed.
 * It searches through your knowledge base using keyword matching
 * and returns accurate, structured medical responses.
 */

import knowledgeBase from "../data/knowledge_base.json";

// ── Flatten all entries from all topics into one searchable list ─────────────
const ALL_ENTRIES = [
  ...(knowledgeBase.symptoms_diseases || []),
  ...(knowledgeBase.medicines_dosages || []),
  ...(knowledgeBase.first_aid || []),
  ...(knowledgeBase.diet_wellness || []),
  ...(knowledgeBase.government_schemes || []),
  ...(knowledgeBase.hospitals || []),
  ...(knowledgeBase.custom_qa || []),
];

// ── Urgency config ────────────────────────────────────────────────────────────
const URGENCY_LABELS = {
  EMERGENCY: "🚨 EMERGENCY — Call 112 immediately",
  HIGH:      "⚠️ HIGH URGENCY — Go to hospital today",
  MEDIUM:    "⚡ MEDIUM URGENCY — See a doctor soon",
  LOW:       "✅ LOW URGENCY — Monitor at home",
};

// ── Greeting detection ────────────────────────────────────────────────────────
const GREETINGS = ["hi", "hello", "hey", "namaste", "namaskar", "helo", "hii", "good morning", "good evening", "good afternoon"];
const GREETING_RESPONSE = `Hello! 🙏 I am Swasthya Mitra's Healthcare Assistant.

I can help you with:
• **Symptoms & Diseases** — dengue, malaria, diabetes, TB, and more
• **Medicines & Dosages** — safe dosing information
• **First Aid** — burns, choking, snake bite, heat stroke
• **Diet & Wellness** — Indian diet, hydration, exercise tips
• **Government Schemes** — Ayushman Bharat, Swasthya Sathi, free hospital care
• **Hospitals in Kolkata** — SSKM, NRS, CMC, CNCI & emergency contacts

How can I help you today? Please remember — I provide general health information and cannot replace a doctor's advice.`;

// ── Thank you / goodbye detection ─────────────────────────────────────────────
const THANKS = ["thank", "thanks", "thank you", "dhanyawad", "shukriya", "bye", "goodbye", "ok bye"];
const THANKS_RESPONSE = `You're welcome! 🙏 Take care of your health.

Remember — for any medical emergency in Kolkata, call **112** immediately.
Free ambulance service: **102**

Stay healthy! 💚`;

// ── Emergency keyword detection (always highest priority) ────────────────────
const EMERGENCY_KEYWORDS = [
  "can't breathe", "cannot breathe", "not breathing", "stopped breathing",
  "heart attack", "chest pain sweating", "unconscious", "not waking up",
  "severe bleeding", "blood everywhere", "overdose", "poisoning",
  "stroke", "face drooping", "can't speak", "slurred speech",
  "drowning", "electric shock", "electrocution",
  "snake bite", "bitten by snake",
  "suicidal", "want to die", "kill myself",
];

// ── Score calculator: count how many keywords match the user query ─────────────
function scoreEntry(entry, query) {
  const q = query.toLowerCase();
  let score = 0;

  // Check keywords array
  if (entry.keywords) {
    for (const kw of entry.keywords) {
      if (q.includes(kw.toLowerCase())) {
        score += 3; // Strong match
      }
    }
  }

  // Check name/title
  if (entry.name && q.includes(entry.name.toLowerCase())) {
    score += 4;
  }
  if (entry.question && q.includes(entry.question.toLowerCase().slice(0, 20))) {
    score += 2;
  }

  // Check symptoms array
  if (entry.symptoms) {
    for (const sym of entry.symptoms) {
      const shortSym = sym.toLowerCase().split(" ").slice(0, 2).join(" ");
      if (q.includes(shortSym)) {
        score += 2;
      }
    }
  }

  // Check tags
  if (entry.tags) {
    for (const tag of entry.tags) {
      if (q.includes(tag.toLowerCase())) {
        score += 1;
      }
    }
  }

  return score;
}

// ── Format a disease/symptom entry into a readable response ──────────────────
function formatDiseaseResponse(entry) {
  let response = "";

  // Add urgency badge
  if (entry.urgency && URGENCY_LABELS[entry.urgency]) {
    response += `**${URGENCY_LABELS[entry.urgency]}**\n\n`;
  }

  // Main response text
  if (entry.response) {
    response += entry.response;
  }

  // Add symptoms list if present
  if (entry.symptoms && entry.symptoms.length > 0) {
    response += `\n\n**Common symptoms:**\n${entry.symptoms.slice(0, 6).map(s => `• ${s}`).join("\n")}`;
  }

  // Add warning signs
  if (entry.warning_signs && entry.warning_signs.length > 0) {
    response += `\n\n**⚠️ Go to hospital immediately if:**\n${entry.warning_signs.slice(0, 4).map(s => `• ${s}`).join("\n")}`;
  }

  // Add season info for diseases
  if (entry.season) {
    response += `\n\n🗓️ *${entry.season}*`;
  }

  response += "\n\n---\n*This is general information. Please consult a qualified doctor for proper diagnosis and treatment.*";
  return response;
}

// ── Format a medicine entry ───────────────────────────────────────────────────
function formatMedicineResponse(entry) {
  let response = entry.response || "";

  if (entry.adult_dose) {
    response += `\n\n**💊 Adult dose:** ${entry.adult_dose}`;
  }
  if (entry.child_dose) {
    response += `\n**👶 Children:** ${entry.child_dose}`;
  }
  if (entry.avoid_if && entry.avoid_if.length > 0) {
    response += `\n\n**⛔ Avoid if:** ${entry.avoid_if.join(", ")}`;
  }
  if (entry.warning) {
    response += `\n\n**⚠️ Warning:** ${entry.warning}`;
  }

  response += "\n\n---\n*Always follow your doctor's prescription. Do not self-medicate.*";
  return response;
}

// ── Format a first aid entry ──────────────────────────────────────────────────
function formatFirstAidResponse(entry) {
  let response = "";

  if (entry.urgency && URGENCY_LABELS[entry.urgency]) {
    response += `**${URGENCY_LABELS[entry.urgency]}**\n\n`;
  }

  response += entry.response || "";

  if (entry.steps && entry.steps.length > 0) {
    response += `\n\n**Steps to follow:**\n${entry.steps.map(s => `${s}`).join("\n")}`;
  }
  if (entry.steps_adult) {
    response += `\n\n**For adults:**\n${entry.steps_adult.join("\n")}`;
  }

  if (entry.do_not && entry.do_not.length > 0) {
    response += `\n\n**❌ Do NOT:**\n${entry.do_not.map(s => `• ${s}`).join("\n")}`;
  }

  response += "\n\n---\n*For serious injuries always call 112.*";
  return response;
}

// ── Format a hospital/government scheme entry ─────────────────────────────────
function formatInfoResponse(entry) {
  return (entry.response || "") + "\n\n---\n*Information may change — always verify by calling the helpline.*";
}

// ── Build response based on entry type ───────────────────────────────────────
function buildResponse(entry) {
  // If entry has a category or if we can guess it based on properties
  if (entry.symptoms || entry.warning_signs || entry.diagnosis) return formatDiseaseResponse(entry);
  if (entry.adult_dose || entry.child_dose) return formatMedicineResponse(entry);
  if (entry.steps || entry.do_not) return formatFirstAidResponse(entry);
  
  // Default parsing for QA and other string-based types
  return (entry.response || entry.answer || "") + "\n\n---\n*Information may change — always verify by calling the helpline.*";
}

// ── Emergency check ───────────────────────────────────────────────────────────
function checkEmergency(query) {
  const q = query.toLowerCase();
  if (EMERGENCY_KEYWORDS.some(kw => q.includes(kw))) return true;

  // Compound indicators (Chest Pain + Sweat/Breath or Smoking + Chest Pain + Breath)
  const hasChestPain = q.includes("chest pain") || q.includes("heart pain") || q.includes("angina") || q.includes("crushing pain") || q.includes("chest tightness");
  const hasSweating = q.includes("sweat") || q.includes("sweating") || q.includes("profuse");
  const hasBreath = q.includes("breath") || q.includes("breathing") || q.includes("dyspnea") || q.includes("sob") || q.includes("shortness");

  if (hasChestPain && (hasSweating || hasBreath)) return true;

  // Stroke complex signs
  const hasStrokeSigns = q.includes("stroke") || (q.includes("droop") && q.includes("face")) || (q.includes("slurred") && q.includes("speech")) || (q.includes("arm") && q.includes("weakness"));
  if (hasStrokeSigns) return true;

  return false;
}

// ── Main search function (exported) ──────────────────────────────────────────
/**
 * Main function — takes a user message, returns a response object.
 *
 * @param {string} userMessage
 * @returns {{ response: string, urgency: string, matched: boolean, entryName: string }}
 */
export function searchKnowledgeBase(userMessage) {
  const q = userMessage.trim().toLowerCase();

  // 1. Greeting detection
  if (GREETINGS.some(g => q === g || q.startsWith(g + " ") || q === g + "!")) {
    return { response: GREETING_RESPONSE, urgency: "LOW", matched: true, entryName: "Greeting" };
  }

  // 2. Thanks/bye detection
  if (THANKS.some(t => q.includes(t))) {
    return { response: THANKS_RESPONSE, urgency: "LOW", matched: true, entryName: "Farewell" };
  }

  // 3. Emergency keyword check (highest priority)
  if (checkEmergency(q)) {
    return {
      response: `🚨 **EMERGENCY — Call 112 IMMEDIATELY**\n\nBased on what you described, this sounds like a medical emergency.\n\n**Call 112 right now** — this is India's national emergency number for ambulance, police, and fire.\n\nFree ambulance in West Bengal: **102**\n\nDo not wait — go to the nearest emergency hospital:\n• SSKM Hospital Emergency: 033-2223-6161\n• NRS Hospital: 033-2265-0108\n• Calcutta Medical College: 033-2241-1354\n\n---\n*If this is a mental health emergency, call iCall: 9152987821 or Vandrevala Foundation: 1860-2662-345 (24/7)*`,
      urgency: "EMERGENCY",
      matched: true,
      entryName: "Emergency"
    };
  }

  // 4. Score all entries and find best matches
  const scored = ALL_ENTRIES
    .map(entry => ({ entry, score: scoreEntry(entry, q) }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score);

  // 5. If good match found
  if (scored.length > 0 && scored[0].score >= 2) {
    const best = scored[0].entry;
    return {
      response: buildResponse(best),
      urgency: best.urgency || "LOW",
      matched: true,
      entryName: best.name || best.question || "Medical Information",
      relatedTopics: scored.slice(1, 3).map(s => s.entry.name || s.entry.question).filter(Boolean),
    };
  }

  // 6. No match found — give helpful fallback
  return {
    response: `I don't have specific information about "${userMessage}" in my knowledge base right now.

**Here's what I can help you with:**
• Type a disease name (dengue, malaria, typhoid, diabetes...)
• Describe your symptoms (fever, headache, chest pain...)
• Ask about a medicine (paracetamol, ORS, ibuprofen...)
• Ask about first aid (burn, choking, snake bite...)
• Ask about government schemes (Ayushman Bharat, Swasthya Sathi...)
• Ask about hospitals in Kolkata

**For urgent concerns:**
🚨 Medical emergency: Call **112**
🏥 Free ambulance: Call **102**
💬 Mental health support: **9152987821**

---
*For specific medical advice, please consult a qualified doctor.*`,
    urgency: "LOW",
    matched: false,
    entryName: "Not Found",
  };
}

export default searchKnowledgeBase;
