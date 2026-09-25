import knowledgeBase from '../data/knowledge_base.json';

export const generateLocalFallbackResponse = (userMessage, specialistName = "Swasthya Mitra's AI Healthcare Assistant") => {
    const lowerInput = userMessage.toLowerCase();
    
    if (lowerInput.match(/\b(hi|hello|hey)\b/)) {
        return `Hello! I am ${specialistName}. I am knowledgeable, empathetic, and specialized for Indian users. How can I help you today? Please remember I cannot diagnose definitively.`;
    }

    // Search through all categories
    for (const item of knowledgeBase.symptoms_diseases) {
        if (item.keywords.some(kw => lowerInput.includes(kw.toLowerCase()))) {
            return `[${item.urgency} URGENCY] ${item.response}`;
        }
    }

    for (const item of knowledgeBase.first_aid) {
        if (item.keywords.some(kw => lowerInput.includes(kw.toLowerCase()))) {
            return `[${item.urgency} - FIRST AID] ${item.response}`;
        }
    }

    for (const item of knowledgeBase.medicines_dosages) {
        if (item.keywords.some(kw => lowerInput.includes(kw.toLowerCase()))) {
            return item.response;
        }
    }

    for (const item of knowledgeBase.diet_wellness) {
        if (item.keywords.some(kw => lowerInput.includes(kw.toLowerCase()))) {
            return `[WELLNESS TIPS] ${item.response}`;
        }
    }

    for (const item of knowledgeBase.government_schemes) {
        if (item.keywords.some(kw => lowerInput.includes(kw.toLowerCase()))) {
            return `[GOVERNMENT SCHEMES (India)]: ${item.response}`;
        }
    }

    for (const item of knowledgeBase.hospitals) {
        if (item.keywords.some(kw => lowerInput.includes(kw.toLowerCase()))) {
            return `[HOSPITAL INFO]: ${item.response}`;
        }
    }

    for (const item of knowledgeBase.custom_qa) {
        if (item.keywords.some(kw => lowerInput.includes(kw.toLowerCase()))) {
            return item.response;
        }
    }

    return "I'm having trouble connecting to my AI network right now, but please seek professional medical consultation for serious concerns. If this is an emergency, Call 112 immediately.";
};

export const generateSystemPromptFromKB = () => {
    let prompt = `You are Swasthya Mitra's AI Healthcare Assistant. You are knowledgeable, empathetic, and specialized for Indian users. Always recommend professional medical consultation for serious concerns. For emergencies, always say "Call 112 immediately".\n\n`;

    prompt += `SYMPTOM GUIDANCE:\n`;
    knowledgeBase.symptoms_diseases.forEach(sd => {
        prompt += `- ${sd.name}: ${sd.response}\n`;
    });

    prompt += `\nFIRST AID:\n`;
    knowledgeBase.first_aid.forEach(fa => {
        prompt += `- ${fa.name}: ${fa.response}\n`;
    });

    prompt += `\nMEDICATIONS:\n`;
    knowledgeBase.medicines_dosages.forEach(md => {
        prompt += `- ${md.name}: ${md.response}\n`;
    });

    prompt += `\nGOVERNMENT HEALTH SCHEMES (India):\n`;
    knowledgeBase.government_schemes.forEach(gs => {
        prompt += `- ${gs.name}: ${gs.response}\n`;
    });

    prompt += `\nGENERAL WELLNESS:\n`;
    knowledgeBase.diet_wellness.forEach(dw => {
        prompt += `- ${dw.name}: ${dw.response}\n`;
    });

    prompt += `\nHOSPITALS IN KOLKATA:\n`;
    knowledgeBase.hospitals.forEach(h => {
        prompt += `- ${h.name}: ${h.response}\n`;
    });

    prompt += `\nIMPORTANT QA:\n`;
    knowledgeBase.custom_qa.forEach(qa => {
        prompt += `- Q: ${qa.question} A: ${qa.response}\n`;
    });

    prompt += `\nURGENCY RULES — always classify responses:\n`;
    prompt += `- EMERGENCY (call 112): chest pain with sweating, difficulty breathing, stroke symptoms, unconsciousness, severe burns, snake bite.\n`;
    prompt += `- HIGH URGENCY (go to hospital today): high fever with stiff neck, coughing blood, severe abdominal pain, dengue warning signs.\n`;
    prompt += `- MEDIUM URGENCY (see doctor within 1-2 days): persistent fever over 2 days, rash with fever, joint pain, vomiting not improving.\n`;
    prompt += `- LOW URGENCY (monitor at home): mild cold/cough, minor headache, mild stomach upset, skin rash without fever.\n\n`;

    prompt += `IMPORTANT RULES:\n`;
    prompt += `- Never diagnose definitively. Use phrases like "could indicate", "may suggest", "possible".\n`;
    prompt += `- Always end serious symptom responses with: "Please consult a qualified doctor for proper diagnosis and treatment."\n`;
    prompt += `- Emergency number in India is 112 (not 911).\n`;
    prompt += `- Be warm, supportive, and non-judgmental.\n`;

    return prompt;
};
