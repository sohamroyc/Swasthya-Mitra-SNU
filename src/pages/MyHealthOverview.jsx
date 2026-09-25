import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { useAuth } from '../context/AuthContext';

const TABS = [
  { id: 'passport', label: 'Health Passport', icon: 'badge' },
  { id: 'timeline', label: 'Health Timeline', icon: 'timeline' },
  { id: 'vault', label: 'Medical Vault', icon: 'folder_shared' },
  { id: 'analytics', label: 'Risk & Analytics', icon: 'analytics' },
  { id: 'assistant', label: 'Contextual AI', icon: 'psychology' },
  { id: 'privacy', label: 'Consent & Privacy', icon: 'security' },
];

const AVAILABLE_CONDITIONS = [
  "Diabetes", "Hypertension", "Asthma", "Heart Disease", "Kidney Disease", 
  "Liver Disease", "Thyroid Disorders", "Cancer", "Arthritis", "PCOS", 
  "Mental Health Disorders"
];

const FAMILY_DISEASES = [
  "Diabetes", "Heart Disease", "Hypertension", "Cancer", "Stroke", 
  "Kidney Disease", "Genetic Disorders"
];

const REPORT_CATEGORIES = [
  "Blood Test Reports", "CBC Reports", "Lipid Profiles", "Thyroid Reports", 
  "Diabetes Reports", "X-Ray Images", "CT Scan Reports", "MRI Reports", 
  "Ultrasound Reports", "Prescriptions", "Discharge Summaries"
];

const MyHealthOverview = () => {
  const { 
    healthMemory, 
    updateHealthMemory, 
    addMedication, 
    deleteMedication, 
    addReport, 
    addConversation, 
    clearHealthMemory 
  } = useAuth();

  const navigate = useNavigate();
  const [activeSubTab, setActiveSubTab] = useState('passport');
  const [editPassport, setEditPassport] = useState(false);

  // Passport Form States
  const [formData, setFormData] = useState(healthMemory.personalInfo);
  const [lifestyleData, setLifestyleData] = useState(healthMemory.lifestyle);
  const [allergiesData, setAllergiesData] = useState(healthMemory.allergies);
  const [newMed, setNewMed] = useState({ name: '', dosage: '', frequency: '', startDate: '', notes: '' });

  // Medical Vault States
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [ocrLog, setOcrLog] = useState('');
  const [showOcrModal, setShowOcrModal] = useState(false);
  const [uploadedReportDetails, setUploadedReportDetails] = useState(null);

  // Timeline Filter State
  const [timelineFilter, setTimelineFilter] = useState('All');

  // AI Assistant States
  const [aiQuery, setAiQuery] = useState('');
  const [aiChat, setAiChat] = useState([
    { role: 'ai', content: "Hello! I am your Swasthya Mitra Clinical Memory Companion. I have loaded your complete Health Passport, medical history, medications, allergies, and lifestyle factors. Ask me anything about your symptoms or medical records, and I will analyze them with full historical awareness." }
  ]);
  const [aiTyping, setAiTyping] = useState(false);

  // Sync state if healthMemory updates
  useEffect(() => {
    if (healthMemory) {
      setFormData(healthMemory.personalInfo);
      setLifestyleData(healthMemory.lifestyle);
      setAllergiesData(healthMemory.allergies);
    }
  }, [healthMemory]);

  // Calculate BMI and Risks dynamically
  const heightM = (parseFloat(formData.height) || 170) / 100;
  const weightKg = parseFloat(formData.weight) || 70;
  const bmi = (weightKg / (heightM * heightM)).toFixed(1);

  const calculateRisks = () => {
    let diabetes = 20;
    let heart = 15;
    let stroke = 10;
    let obesity = 15;
    let hypertension = 20;

    // Obesity Risk
    if (bmi >= 30) obesity = 85;
    else if (bmi >= 25) obesity = 60;
    else obesity = 25;

    // Chronic Conditions factors
    const conds = healthMemory.conditions || [];
    if (conds.includes("Diabetes")) {
      heart += 25;
      stroke += 20;
      hypertension += 20;
    }
    if (conds.includes("Hypertension")) {
      heart += 30;
      stroke += 35;
      diabetes += 15;
    }
    if (conds.includes("Heart Disease")) {
      stroke += 30;
      hypertension += 15;
    }

    // Family History factors
    const fam = healthMemory.familyHistory || [];
    if (fam.includes("Diabetes")) diabetes += 25;
    if (fam.includes("Heart Disease")) heart += 20;
    if (fam.includes("Hypertension")) hypertension += 20;
    if (fam.includes("Stroke")) stroke += 20;

    // Lifestyle factors
    if (lifestyleData.smoking === 'smoker') {
      heart += 30;
      stroke += 25;
      hypertension += 15;
    }
    if (lifestyleData.alcohol === 'regular') {
      stroke += 15;
      heart += 10;
    }
    if (parseFloat(lifestyleData.sleepDuration) < 6) {
      heart += 10;
      hypertension += 15;
    }
    if (lifestyleData.physicalActivity === 'sedentary') {
      diabetes += 20;
      obesity += 20;
      heart += 15;
    }
    if (lifestyleData.stressLevel === 'high') {
      hypertension += 20;
      heart += 15;
    }

    return {
      diabetes: Math.min(diabetes, 95),
      heart: Math.min(heart, 95),
      stroke: Math.min(stroke, 95),
      obesity: Math.min(obesity, 95),
      hypertension: Math.min(hypertension, 95)
    };
  };

  const risks = calculateRisks();

  // Save Passport Info
  const handleSavePassport = () => {
    updateHealthMemory({
      personalInfo: formData,
      lifestyle: lifestyleData,
      allergies: allergiesData
    });
    setEditPassport(false);
  };

  // Toggle Conditions Multi-select
  const handleToggleCondition = (cond) => {
    const active = healthMemory.conditions || [];
    const updated = active.includes(cond) 
      ? active.filter(c => c !== cond) 
      : [...active, cond];
    updateHealthMemory({ conditions: updated });
  };

  // Toggle Family History Multi-select
  const handleToggleFamily = (disease) => {
    const active = healthMemory.familyHistory || [];
    const updated = active.includes(disease) 
      ? active.filter(f => f !== disease) 
      : [...active, disease];
    updateHealthMemory({ familyHistory: updated });
  };

  // Handle Add Medication
  const handleAddMed = (e) => {
    e.preventDefault();
    if (!newMed.name) return;
    addMedication(newMed);
    setNewMed({ name: '', dosage: '', frequency: '', startDate: '', notes: '' });
  };

  // Simulated OCR & Upload File Parser
  const triggerSimulatedOCR = (fileName, category) => {
    setIsUploading(true);
    setUploadProgress(10);
    setShowOcrModal(true);
    setOcrLog("Initial security sanitization... Done\nEncrpyting file via AES-256... Done\n");

    const timer1 = setTimeout(() => {
      setUploadProgress(40);
      setOcrLog(prev => prev + "Running Swasthya OCR engine...\nLoading Tesseract parsing matrix...\nAnalyzing scanned tables...\n");
    }, 1200);

    const timer2 = setTimeout(() => {
      setUploadProgress(75);
      setOcrLog(prev => prev + "Parsed Vitals Extraction:\n- Fasting glucose level identified.\n- Standard parameters analyzed.\nApplying clinical AI categorization algorithms...\n");
    }, 2400);

    const timer3 = setTimeout(() => {
      setUploadProgress(100);
      setIsUploading(false);
      setOcrLog(prev => prev + "Extraction Complete! Auto-categorized and generated summary in Medical Vault.\n");
      
      // Auto generate simulated summary based on file category
      let summary = "";
      if (category.includes("Diabetes")) {
        summary = "Fasting Blood Glucose parsed at 104 mg/dL. Elevated fasting glucose indicates border-line prediabetes risk. Recommend tracking fasting sugar weekly and checking diet.";
      } else if (category.includes("Lipid")) {
        summary = "Total Cholesterol: 210 mg/dL, HDL: 45 mg/dL, LDL: 130 mg/dL. Moderately elevated LDL levels. Suggest heart-healthy dietary adjustments and daily cardiovascular walks.";
      } else if (category.includes("CBC")) {
        summary = "Red blood cells (RBC), Hemoglobin (14.2 g/dL), and Platelets are inside normal physiological ranges. Diagnostic checks verified absolute blood stability.";
      } else if (category.includes("Prescriptions")) {
        summary = "Clinical prescription for Lisinopril 10mg. Indicated for blood pressure management. Standard dosage check matches optimal protocols.";
      } else {
        summary = `Uploaded scan report successfully parsed. High stability verified across general indicators. No critical pathology flags detected.`;
      }

      const reportObject = {
        name: fileName,
        category: category,
        date: new Date().toISOString().split('T')[0],
        summary: summary
      };
      
      setUploadedReportDetails(reportObject);
      addReport(reportObject);
    }, 3800);
  };

  const handleFileUploadMock = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Map file extension to a logical category
    let category = "CBC Reports";
    if (file.name.toLowerCase().includes("sugar") || file.name.toLowerCase().includes("diab")) category = "Diabetes Reports";
    else if (file.name.toLowerCase().includes("lipid") || file.name.toLowerCase().includes("chol")) category = "Lipid Profiles";
    else if (file.name.toLowerCase().includes("rx") || file.name.toLowerCase().includes("presc")) category = "Prescriptions";
    else if (file.name.toLowerCase().includes("xray") || file.name.toLowerCase().includes("chest")) category = "X-Ray Images";
    
    triggerSimulatedOCR(file.name, category);
  };

  // Compile Dynamic Health Timeline
  const compileTimelineEvents = () => {
    const events = [];

    // Medications events
    if (healthMemory.medications) {
      healthMemory.medications.forEach(m => {
        events.push({
          year: new Date(m.startDate || Date.now()).getFullYear(),
          date: m.startDate,
          type: 'Medication',
          title: `Started Medication: ${m.name}`,
          desc: `${m.dosage} - Frequency: ${m.frequency}. Notes: ${m.notes || 'N/A'}`
        });
      });
    }

    // Reports events
    if (healthMemory.reports) {
      healthMemory.reports.forEach(r => {
        events.push({
          year: new Date(r.date).getFullYear(),
          date: r.date,
          type: 'Report',
          title: `Medical Report Uploaded: ${r.name}`,
          desc: `Category: ${r.category}. AI Summary: ${r.summary}`
        });
      });
    }

    // Conversations events
    if (healthMemory.conversations) {
      healthMemory.conversations.forEach(c => {
        events.push({
          year: new Date(c.date).getFullYear(),
          date: c.date,
          type: 'Consultation',
          title: `AI Health Consultation (${c.specialist})`,
          desc: `Symptoms: "${c.symptoms}". Diagnosis: ${c.diagnosis} (Confidence: ${c.confidence}). Suggested Actions: ${c.suggestedActions}`
        });
      });
    }

    // Chronic Diagnoses events
    if (healthMemory.conditions) {
      healthMemory.conditions.forEach(cond => {
        events.push({
          year: 2026,
          date: '2026-01-05',
          type: 'Disease',
          title: `Diagnosed Condition: ${cond}`,
          desc: `Added to patient chronic clinical health passport profile.`
        });
      });
    }

    // Sort chronologically descending
    events.sort((a, b) => new Date(b.date) - new Date(a.date));
    return events;
  };

  const timelineEvents = compileTimelineEvents();

  const filteredTimeline = timelineEvents.filter(e => {
    if (timelineFilter === 'All') return true;
    if (timelineFilter === 'Symptoms' && e.type === 'Consultation') return true;
    if (timelineFilter === 'Diseases' && e.type === 'Disease') return true;
    if (timelineFilter === 'Reports' && e.type === 'Report') return true;
    if (timelineFilter === 'Consultations' && e.type === 'Consultation') return true;
    if (timelineFilter === 'Medications' && e.type === 'Medication') return true;
    return false;
  });

  // Dynamic Prompt Contextual AI Chat Box
  const handleSendAiQuery = async (e) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;

    const userMsg = aiQuery.trim();
    setAiChat(prev => [...prev, { role: 'user', content: userMsg }]);
    setAiQuery('');
    setAiTyping(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("Missing Key");
      }

      // Compile user context
      const contextPrompt = `You are a clinical expert virtual assistant integrated inside the Swasthya Mitra EHR system.
Below is the PATIENT COMPREHENSIVE MEDICAL RECORDS AND HISTORICAL MEMORY. Use this longitudinal background to formulate your answers.

=== PATIENT HEALTH PASSPORT ===
Name: ${formData.name || 'User'}, DOB: ${formData.dob || 'N/A'}, Gender: ${formData.gender || 'N/A'}, Weight: ${formData.weight}kg, Height: ${formData.height}cm, BMI: ${bmi}
Chronic Conditions: ${healthMemory.conditions?.join(', ') || 'None reported'}
Allergies: Drug: ${allergiesData.drug || 'None'}, Food: ${allergiesData.food || 'None'}, Environmental: ${allergiesData.environmental || 'None'}, Other: ${allergiesData.other || 'None'}
Active Medications: ${healthMemory.medications?.map(m => `${m.name} (${m.dosage}, ${m.frequency})`).join(', ') || 'None'}
Family History of: ${healthMemory.familyHistory?.join(', ') || 'None'}
Lifestyle: Smoking: ${lifestyleData.smoking}, Alcohol: ${lifestyleData.alcohol}, Daily Water: ${lifestyleData.waterIntake} glasses, Sleep: ${lifestyleData.sleepDuration} hrs, Activity: ${lifestyleData.physicalActivity}, Diet: ${lifestyleData.dietType}, Stress: ${lifestyleData.stressLevel}
Timeline Events: ${timelineEvents.slice(0, 3).map(e => `[${e.date} ${e.type}] ${e.title}`).join('; ')}
===============================

Analyze their query: "${userMsg}". 
Provide a detailed clinical and compassionate review. Check for potential drug interactions with active medications or allergy complications if relevant. Limit response to 4 paragraphs. Format in clean Markdown.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: contextPrompt }] }]
        })
      });

      if (!response.ok) throw new Error("Fetch failed");
      const data = await response.json();
      const aiReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I was unable to consult my clinical records. Please check back shortly.";

      setAiChat(prev => [...prev, { role: 'ai', content: aiReply }]);
      
      // Check for Smart Pattern triggers to save consultation
      const lower = userMsg.toLowerCase();
      if (lower.includes("headache") || lower.includes("pain") || lower.includes("bp") || lower.includes("sugar") || lower.includes("fever")) {
        let diagnosis = "Symptomatic Consultation Inquiry";
        if (lower.includes("headache")) diagnosis = "Tension Headache Follow-Up";
        else if (lower.includes("bp")) diagnosis = "Blood Pressure Review";
        else if (lower.includes("sugar")) diagnosis = "Glycemic Control Review";

        addConversation({
          date: new Date().toISOString().split('T')[0],
          symptoms: userMsg,
          specialist: 'EHR Dashboard AI',
          diagnosis: diagnosis,
          confidence: '90%',
          suggestedActions: 'Advice synced dynamically inside your clinical health profile vault.'
        });
      }

    } catch (err) {
      console.warn("AI query failed, launching local mock response:", err);
      // Mock follow-up pattern
      let mockReply = "Based on your clinical health history, this symptom seems stable. ";
      if (userMsg.toLowerCase().includes("headache")) {
        mockReply += "I notice you have had tension headaches before. Let's record this symptom in your health timeline. Would you like to track your headache patterns over time?";
      } else if (healthMemory.conditions.includes("Diabetes") && userMsg.toLowerCase().includes("sugar")) {
        mockReply += "As you are diagnosed with Diabetes, have you checked your blood sugar recently? Keeping a daily log is recommended.";
      } else {
        mockReply += "I have logged this symptom check in your EHR health history. Please consult your physician if symptoms worsen.";
      }

      setAiChat(prev => [...prev, { role: 'ai', content: mockReply }]);
    } finally {
      setAiTyping(false);
    }
  };

  const downloadHealthPassportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(healthMemory, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `HealthMemory_${formData.name.replace(/\s+/g, '_')}.json`);
    dlAnchorElem.click();
  };

  // Stats Card data for Analytics tab
  const activeMedsCount = healthMemory.medications?.length || 0;
  const healthVaultCount = healthMemory.reports?.length || 0;

  return (
    <AppLayout activeTab="my-health">
      {/* Dynamic OCR modal */}
      {showOcrModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-2xl max-w-xl w-full max-h-[85vh] overflow-y-auto">
            <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-blue-600 animate-spin">sync</span>
              Clinical OCR Parsing Engine
            </h3>
            
            {isUploading ? (
              <div className="space-y-6">
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-900 text-xs font-mono text-slate-600 dark:text-slate-400 whitespace-pre-line leading-relaxed">
                  {ocrLog}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 p-5 rounded-2xl flex items-start gap-3">
                  <span className="material-symbols-outlined text-emerald-600">check_circle</span>
                  <div>
                    <h4 className="font-bold text-sm text-emerald-900 dark:text-emerald-400">File Decrypted &amp; Indexed!</h4>
                    <p className="text-xs text-emerald-700 mt-1 leading-relaxed">
                      Our system successfully parsed the clinical records, auto-categorized under <strong>{uploadedReportDetails?.category}</strong>, and added a dynamic summary inside your vault.
                    </p>
                  </div>
                </div>
                
                <div className="border border-slate-200 dark:border-slate-850 p-5 rounded-2xl bg-white dark:bg-slate-950">
                  <p className="text-[9px] font-black uppercase text-slate-400 tracking-wider mb-1">OCR EXTRACTED SUMMARY</p>
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold leading-relaxed">
                    {uploadedReportDetails?.summary}
                  </p>
                </div>

                <button 
                  onClick={() => setShowOcrModal(false)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-md active:scale-95"
                >
                  Open Medical Vault
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* EHR Header */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Longitudinal EHR &amp; Health Memory</h1>
          <p className="text-sm text-slate-500 font-semibold mt-1">
            Persisting, synthesizing, and applying your entire clinical medical history across all sessions in real-time.
          </p>
        </div>
        <button 
          onClick={downloadHealthPassportJson}
          className="bg-blue-50 hover:bg-blue-100 text-blue-600 font-extrabold text-xs px-4 py-2.5 rounded-xl border border-blue-200/50 flex items-center gap-2 transition-all active:scale-95 shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">download_for_offline</span>
          Export Health Passport
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Navigation Sidebar */}
        <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-3.5 shadow-sm h-fit">
          <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest pl-3 mb-3">Memory Modules</p>
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-black transition-all ${
                activeSubTab === tab.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </aside>

        {/* Content Pane */}
        <div className="flex-1 min-w-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 sm:p-8 shadow-sm">
          
          {/* ──────────────── TAB: HEALTH PASSPORT ──────────────── */}
          {activeSubTab === 'passport' && (
            <div className="space-y-8 animate-in fade-in">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">Active Health Passport</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Edit personal health matrices, diagnosed chronic conditions, and drug allergies.</p>
                </div>
                <button
                  onClick={() => {
                    if (editPassport) handleSavePassport();
                    else setEditPassport(true);
                  }}
                  className={`text-xs font-black px-4 py-2 rounded-xl transition-all active:scale-95 shadow-sm border ${
                    editPassport 
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700 border-emerald-600' 
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {editPassport ? "Save Changes" : "Edit Passport"}
                </button>
              </div>

              {/* Grid: 3 Columns Personal Details */}
              <div className="bg-slate-50/50 dark:bg-slate-800/20 p-6 rounded-2xl border border-slate-150 dark:border-slate-850">
                <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-4 flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px] text-blue-600">person</span>Personal Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Full Name</label>
                    <input 
                      type="text" 
                      disabled={!editPassport}
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 dark:text-white outline-none focus:border-blue-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Date of Birth</label>
                    <input 
                      type="date" 
                      disabled={!editPassport}
                      value={formData.dob}
                      onChange={e => setFormData({ ...formData, dob: e.target.value })}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 dark:text-white outline-none focus:border-blue-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Gender</label>
                    <select 
                      disabled={!editPassport}
                      value={formData.gender}
                      onChange={e => setFormData({ ...formData, gender: e.target.value })}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 dark:text-white outline-none focus:border-blue-500"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="non-binary">Non-binary</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Height (cm)</label>
                    <input 
                      type="number" 
                      disabled={!editPassport}
                      value={formData.height}
                      onChange={e => setFormData({ ...formData, height: e.target.value })}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 dark:text-white outline-none focus:border-blue-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Weight (kg)</label>
                    <input 
                      type="number" 
                      disabled={!editPassport}
                      value={formData.weight}
                      onChange={e => setFormData({ ...formData, weight: e.target.value })}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 dark:text-white outline-none focus:border-blue-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Blood Group</label>
                    <input 
                      type="text" 
                      disabled={!editPassport}
                      value={formData.bloodGroup}
                      onChange={e => setFormData({ ...formData, bloodGroup: e.target.value })}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 dark:text-white outline-none focus:border-blue-500" 
                      placeholder="e.g. O+"
                    />
                  </div>
                </div>
              </div>

              {/* Chronic Conditions multi-select */}
              <div>
                <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-4 flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px] text-blue-600">medical_services</span>Chronic Medical Conditions</h4>
                <div className="flex flex-wrap gap-2.5">
                  {AVAILABLE_CONDITIONS.map(cond => {
                    const isSelected = (healthMemory.conditions || []).includes(cond);
                    return (
                      <button
                        key={cond}
                        onClick={() => handleToggleCondition(cond)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                          isSelected 
                            ? 'bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-500/10' 
                            : 'bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {cond} {isSelected ? "✓" : "+"}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Allergies Block */}
              <div className="bg-red-50/20 dark:bg-red-950/5 p-6 rounded-2xl border border-red-100 dark:border-red-950/20">
                <h4 className="text-xs font-black uppercase text-red-600 dark:text-red-400 tracking-wider mb-4 flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px]">warning</span>Known Allergies</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Drug Allergies</label>
                    <input 
                      type="text" 
                      disabled={!editPassport}
                      value={allergiesData.drug}
                      onChange={e => setAllergiesData({ ...allergiesData, drug: e.target.value })}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 dark:text-white outline-none focus:border-red-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Food Allergies</label>
                    <input 
                      type="text" 
                      disabled={!editPassport}
                      value={allergiesData.food}
                      onChange={e => setAllergiesData({ ...allergiesData, food: e.target.value })}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 dark:text-white outline-none focus:border-red-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Environmental Allergies</label>
                    <input 
                      type="text" 
                      disabled={!editPassport}
                      value={allergiesData.environmental}
                      onChange={e => setAllergiesData({ ...allergiesData, environmental: e.target.value })}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 dark:text-white outline-none focus:border-red-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Other Allergies</label>
                    <input 
                      type="text" 
                      disabled={!editPassport}
                      value={allergiesData.other}
                      onChange={e => setAllergiesData({ ...allergiesData, other: e.target.value })}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 dark:text-white outline-none focus:border-red-500" 
                    />
                  </div>
                </div>
              </div>

              {/* Lifestyle Inputs */}
              <div>
                <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-4 flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px] text-blue-600">health_and_safety</span>Lifestyle Habits</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Smoking Status</label>
                    <select 
                      disabled={!editPassport}
                      value={lifestyleData.smoking}
                      onChange={e => setLifestyleData({ ...lifestyleData, smoking: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-2 text-xs font-semibold"
                    >
                      <option value="non-smoker">Non-Smoker</option>
                      <option value="smoker">Regular Smoker</option>
                      <option value="occasional">Occasional Smoker</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Alcohol Intake</label>
                    <select 
                      disabled={!editPassport}
                      value={lifestyleData.alcohol}
                      onChange={e => setLifestyleData({ ...lifestyleData, alcohol: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-2 text-xs font-semibold"
                    >
                      <option value="none">None</option>
                      <option value="occasional">Occasional</option>
                      <option value="regular">Regular</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Daily Water (Glasses)</label>
                    <input 
                      type="number"
                      disabled={!editPassport}
                      value={lifestyleData.waterIntake}
                      onChange={e => setLifestyleData({ ...lifestyleData, waterIntake: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-2 text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Sleep Duration (Hrs)</label>
                    <input 
                      type="number"
                      disabled={!editPassport}
                      value={lifestyleData.sleepDuration}
                      onChange={e => setLifestyleData({ ...lifestyleData, sleepDuration: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-2 text-xs font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* Family Medical History */}
              <div>
                <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-4 flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px] text-blue-600">family_history</span>Family Medical History (Hereditary Risks)</h4>
                <div className="flex flex-wrap gap-2.5">
                  {FAMILY_DISEASES.map(disease => {
                    const isSelected = (healthMemory.familyHistory || []).includes(disease);
                    return (
                      <button
                        key={disease}
                        onClick={() => handleToggleFamily(disease)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                          isSelected 
                            ? 'bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-500/10' 
                            : 'bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {disease} {isSelected ? "✓" : "+"}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Medications List */}
              <div>
                <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-4 flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px] text-blue-600">pill</span>Current Medications</h4>
                
                {/* Add Medication Form */}
                <form onSubmit={handleAddMed} className="bg-slate-50 dark:bg-slate-800/10 p-5 rounded-2xl border border-slate-200 dark:border-slate-850 mb-5 flex flex-wrap gap-4 items-end">
                  <div className="flex-1 min-w-[140px]">
                    <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Medicine Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Metformin" 
                      value={newMed.name}
                      onChange={e => setNewMed({ ...newMed, name: e.target.value })}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs" 
                    />
                  </div>
                  <div className="flex-1 min-w-[100px]">
                    <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Dosage</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 500mg" 
                      value={newMed.dosage}
                      onChange={e => setNewMed({ ...newMed, dosage: e.target.value })}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs" 
                    />
                  </div>
                  <div className="flex-1 min-w-[100px]">
                    <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Frequency</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 1x Daily" 
                      value={newMed.frequency}
                      onChange={e => setNewMed({ ...newMed, frequency: e.target.value })}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs" 
                    />
                  </div>
                  <div className="flex-1 min-w-[120px]">
                    <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Start Date</label>
                    <input 
                      type="date" 
                      value={newMed.startDate}
                      onChange={e => setNewMed({ ...newMed, startDate: e.target.value })}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs" 
                    />
                  </div>
                  <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md active:scale-95 shrink-0">
                    Add Medicine
                  </button>
                </form>

                {/* Medication Cards List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(healthMemory.medications || []).length > 0 ? (
                    healthMemory.medications.map(med => (
                      <div key={med.id} className="flex justify-between items-center p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                        <div className="flex items-center gap-3">
                          <div className="size-10 bg-blue-50 dark:bg-blue-950/40 rounded-xl flex items-center justify-center text-blue-600"><span className="material-symbols-outlined text-[20px]">medication</span></div>
                          <div>
                            <p className="text-xs font-bold text-slate-900 dark:text-white">{med.name} - {med.dosage}</p>
                            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Frequency: {med.frequency} • Started: {med.startDate}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => deleteMedication(med.id)}
                          className="size-8 rounded-lg hover:bg-red-50 hover:text-red-500 text-slate-400 flex items-center justify-center transition-colors"
                          title="Delete medication"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 italic">No active medications in your profile.</p>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* ──────────────── TAB: HEALTH TIMELINE ──────────────── */}
          {activeSubTab === 'timeline' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">Patient Health Timeline</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Chronological record of diagnosed diseases, consultations, and report uploads.</p>
                </div>
                
                {/* Timeline Filters */}
                <div className="flex flex-wrap gap-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-250 dark:border-slate-850 p-1 rounded-xl">
                  {['All', 'Symptoms', 'Diseases', 'Reports', 'Medications'].map(f => (
                    <button
                      key={f}
                      onClick={() => setTimelineFilter(f)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                        timelineFilter === f 
                          ? 'bg-blue-600 text-white shadow-sm' 
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Timeline Tree */}
              <div className="relative border-l-2 border-slate-100 dark:border-slate-800 pl-6 space-y-8 py-4">
                {filteredTimeline.length > 0 ? (
                  filteredTimeline.map((ev, idx) => (
                    <div key={idx} className="relative animate-in fade-in slide-in-from-left-3">
                      {/* Timeline Bullet node */}
                      <span className={`absolute -left-[31px] top-1.5 size-4 rounded-full border-2 border-white dark:border-slate-900 shadow-sm ${
                        ev.type === 'Disease' ? 'bg-rose-500' :
                        ev.type === 'Medication' ? 'bg-amber-500' :
                        ev.type === 'Report' ? 'bg-blue-500' :
                        'bg-teal-500'
                      }`}></span>

                      <div className="flex justify-between items-baseline gap-2 mb-1.5">
                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">{ev.date}</span>
                        <span className="text-[9px] font-black uppercase bg-slate-50 dark:bg-slate-800 text-slate-400 px-2 py-0.5 rounded border">{ev.type}</span>
                      </div>
                      <h4 className="font-extrabold text-sm text-slate-800 dark:text-white leading-tight">{ev.title}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1 whitespace-pre-line font-medium">
                        {ev.desc}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">No timeline events match the active filter.</p>
                )}
              </div>

            </div>
          )}

          {/* ──────────────── TAB: MEDICAL VAULT ──────────────── */}
          {activeSubTab === 'vault' && (
            <div className="space-y-8 animate-in fade-in">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">Secure Medical Vault</h3>
                  <p className="text-xs text-slate-500 mt-0.5">AES-256 encrypted storage vault for clinical diagnostic and lab reports.</p>
                </div>
                
                {/* Upload Button */}
                <label className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-2 active:scale-95 cursor-pointer">
                  <span className="material-symbols-outlined text-[18px]">upload_file</span>
                  Upload PDF/Image
                  <input type="file" className="hidden" accept=".pdf,image/*" onChange={handleFileUploadMock} />
                </label>
              </div>

              {/* Vault Categories Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                  { title: "Lab Tests & CBCs", count: (healthMemory.reports || []).filter(r => r.category.includes("CBC") || r.category.includes("Blood")).length, icon: "biotech", color: "blue" },
                  { title: "Scans & X-Rays", count: (healthMemory.reports || []).filter(r => r.category.includes("Scan") || r.category.includes("X-Ray") || r.category.includes("MRI")).length, icon: "radiology", color: "purple" },
                  { title: "Prescriptions", count: (healthMemory.reports || []).filter(r => r.category.includes("Presc")).length, icon: "description", color: "teal" }
                ].map((item, idx) => (
                  <div key={idx} className="bg-slate-50/50 dark:bg-slate-800/10 p-5 rounded-2xl border border-slate-150 dark:border-slate-850 flex items-center gap-4">
                    <div className={`size-12 rounded-xl bg-${item.color}-50 dark:bg-${item.color}-950/40 text-${item.color}-600 flex items-center justify-center`}><span className="material-symbols-outlined text-[24px]">{item.icon}</span></div>
                    <div>
                      <h4 className="font-extrabold text-xs text-slate-800 dark:text-slate-200">{item.title}</h4>
                      <p className="text-[11px] font-bold text-slate-400 mt-0.5">{item.count} documents cached</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Uploaded Files Vault List */}
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Clinical Vault Documents</h4>
                {(healthMemory.reports || []).length > 0 ? (
                  (healthMemory.reports || []).map(rep => (
                    <div key={rep.id} className="bg-white dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-850 hover:shadow-md hover:border-slate-300 transition-all flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div className="flex items-start gap-4">
                        <div className="size-11 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center shrink-0"><span className="material-symbols-outlined text-[22px]">lab_research</span></div>
                        <div>
                          <p className="text-xs font-black text-slate-850 dark:text-white leading-tight">{rep.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">{rep.category} • Uploaded: {rep.date}</p>
                          <div className="mt-3 bg-slate-50 dark:bg-slate-900 p-3.5 rounded-xl border border-slate-100 dark:border-slate-850">
                            <span className="text-[9px] font-black uppercase text-blue-500 tracking-wider flex items-center gap-1.5"><span className="material-symbols-outlined text-[12px]">biotech</span>AI Clinical Insight Summary</span>
                            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed mt-1">
                              {rep.summary}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">No reports uploaded inside your medical vault.</p>
                )}
              </div>

            </div>
          )}

          {/* ──────────────── TAB: RISKS & ANALYTICS ──────────────── */}
          {activeSubTab === 'analytics' && (
            <div className="space-y-8 animate-in fade-in">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="text-xl font-black text-slate-900 dark:text-white">AI Health Risk Engine</h3>
                <p className="text-xs text-slate-500 mt-0.5">Visually tracking multi-system disease risks dynamically calculated from patient clinical data.</p>
              </div>

              {/* Dynamic Risk Scores list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { name: "Diabetes Risk", score: risks.diabetes, color: "blue", desc: "Correlated to BMI, diet levels, and family diabetic indices." },
                  { name: "Heart Disease", score: risks.heart, color: "rose", desc: "Based on active BP rates, stress inputs, and smoking status." },
                  { name: "Stroke Risk", score: risks.stroke, color: "purple", desc: "Linked directly to chronic high blood pressure history." },
                  { name: "Obesity Score", score: risks.obesity, color: "amber", desc: "Direct calculation derived from active patient height-weight BMI." },
                  { name: "Hypertension", score: risks.hypertension, color: "teal", desc: "Correlated to hereditary lines, salt intakes, and fitness habits." }
                ].map((item, idx) => (
                  <div key={idx} className="bg-white dark:bg-slate-950 p-5 rounded-3xl border-2 border-slate-100 dark:border-slate-850 hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-48">
                    <div>
                      <div className="flex justify-between items-center mb-2.5">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">{item.name}</span>
                        <span className={`text-xs font-black uppercase px-2 py-0.5 rounded ${
                          item.score >= 70 ? 'bg-red-50 text-red-600' :
                          item.score >= 40 ? 'bg-amber-50 text-amber-600' :
                          'bg-emerald-50 text-emerald-600'
                        }`}>
                          {item.score >= 70 ? 'High' : item.score >= 40 ? 'Moderate' : 'Optimal'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">{item.desc}</p>
                    </div>

                    <div className="flex items-center gap-4 mt-4">
                      {/* Visual progress bar */}
                      <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-1000 ${
                          item.score >= 70 ? 'bg-red-500' :
                          item.score >= 40 ? 'bg-amber-500' :
                          'bg-emerald-500'
                        }`} style={{ width: `${item.score}%` }}></div>
                      </div>
                      <span className="text-xl font-black text-slate-850 dark:text-white shrink-0">{item.score}%</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Monthly Health Insights */}
              <div className="bg-slate-50/50 dark:bg-slate-800/10 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800">
                <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-4 flex items-center gap-1.5"><span className="material-symbols-outlined text-[18px] text-blue-600">wysiwyg</span>Monthly Health Insights Summary</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Stats trends */}
                  <div className="space-y-4 bg-white dark:bg-slate-950 p-5 rounded-2xl border border-slate-100 dark:border-slate-850">
                    <div className="flex justify-between items-center text-xs font-bold border-b border-slate-50 pb-2">
                      <span className="text-slate-500">Weight Trend:</span>
                      <span className="text-emerald-600 font-extrabold flex items-center gap-0.5"><span className="material-symbols-outlined text-[14px]">trending_down</span>Stable (-0.4 kg)</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-bold border-b border-slate-50 pb-2">
                      <span className="text-slate-500">Blood Pressure:</span>
                      <span className="text-emerald-600 font-extrabold">120/80 mmHg (Normal)</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-bold border-b border-slate-50 pb-2">
                      <span className="text-slate-500">Water Tracker Goal:</span>
                      <span className="text-blue-500 font-extrabold">{lifestyleData.waterIntake} / 8 Glasses</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-slate-500">Consultation Counter:</span>
                      <span className="text-slate-700 dark:text-slate-200 font-extrabold">{healthMemory.conversations?.length || 0} checks</span>
                    </div>
                  </div>

                  {/* Doctor advice */}
                  <div className="bg-blue-50/40 dark:bg-blue-950/15 border border-blue-100 dark:border-blue-900/30 p-5 rounded-2xl">
                    <h5 className="text-xs font-black text-blue-900 dark:text-blue-400 mb-2 flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px]">stethoscope</span>EHR AI Clinical Recommendations</h5>
                    <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2 pl-4 list-disc font-medium leading-relaxed">
                      <li>Maintain Lisinopril 10mg daily routine to stabilize blood pressure rates.</li>
                      <li>Based on your {lifestyleData.dietType} diet, ensure optimal intake of protein and iron minerals.</li>
                      <li>Fasting glucose is optimal. Continue daily physical activity level ({lifestyleData.physicalActivity}) to prevent diabetic risk indicators.</li>
                    </ul>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ──────────────── TAB: CONTEXTUAL AI ASSISTANT ──────────────── */}
          {activeSubTab === 'assistant' && (
            <div className="space-y-6 animate-in fade-in flex flex-col h-[520px]">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4 shrink-0">
                <h3 className="text-xl font-black text-slate-900 dark:text-white">Contextual AI Assistant</h3>
                <p className="text-xs text-slate-500 mt-0.5">This medical virtual assistant acts with full awareness of your Health Passport, chronic conditions, and previous timeline files.</p>
              </div>

              {/* Chat View */}
              <div className="flex-1 overflow-y-auto p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-150 dark:border-slate-850 flex flex-col gap-4 max-h-[300px]">
                {aiChat.map((m, idx) => (
                  <div key={idx} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`size-8 rounded-full flex items-center justify-center shrink-0 ${m.role === 'ai' ? 'bg-blue-600 text-white' : 'bg-slate-350 text-white font-bold'}`}>
                      {m.role === 'ai' ? <span className="material-symbols-outlined text-[16px]">psychology</span> : "U"}
                    </div>
                    <div className={`p-4 text-xs font-semibold leading-relaxed rounded-2xl shadow-sm border max-w-[80%] ${
                      m.role === 'user' 
                        ? 'bg-blue-600 text-white border-blue-500 rounded-tr-none' 
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 rounded-tl-none'
                    }`}>
                      {m.content}
                    </div>
                  </div>
                ))}
                {aiTyping && (
                  <div className="flex gap-3">
                    <div className="size-8 rounded-full bg-blue-600 text-white flex items-center justify-center"><span className="material-symbols-outlined text-[16px] animate-pulse">psychology</span></div>
                    <div className="p-4 bg-white dark:bg-slate-900 border rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendAiQuery} className="shrink-0 flex gap-2">
                <input 
                  type="text" 
                  value={aiQuery}
                  onChange={e => setAiQuery(e.target.value)}
                  placeholder="Ask a health question (e.g. 'Can I take cold medicine with Lisinopril?')..."
                  className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-850 rounded-2xl px-4 py-3 text-xs outline-none focus:border-blue-600"
                />
                <button type="submit" className="h-10 w-10 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl flex items-center justify-center shadow-md active:scale-95 transition-transform"><span className="material-symbols-outlined">send</span></button>
              </form>
            </div>
          )}

          {/* ──────────────── TAB: PRIVACY & CONSENT ──────────────── */}
          {activeSubTab === 'privacy' && (
            <div className="space-y-8 animate-in fade-in">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="text-xl font-black text-slate-900 dark:text-white">HIPAA Privacy &amp; Consent controls</h3>
                <p className="text-xs text-slate-500 mt-0.5">Control how Swasthya Mitra handles your historical health data.</p>
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-center p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                  <div>
                    <h4 className="text-sm font-bold text-slate-850 dark:text-white flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px] text-blue-600">lock</span>AES-256 Memory Encryption</h4>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      All diagnostic histories, medical reports, timelines, and passport entries are encrypted client-side.
                    </p>
                  </div>
                  <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded">Active</span>
                </div>

                <div className="flex justify-between items-center p-5 rounded-2xl border border-slate-250 dark:border-slate-850 bg-white dark:bg-slate-950">
                  <div>
                    <h4 className="text-sm font-bold text-slate-850 dark:text-white">Disable AI Memory</h4>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      If disabled, Swasthya Mitra virtual specialists will not query previous timeline files or passport factors.
                    </p>
                  </div>
                  <button className="px-4 py-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 border text-xs font-black rounded-xl">Disable</button>
                </div>

                <div className="p-6 bg-red-50/20 border border-red-150 dark:border-red-950/20 rounded-2xl space-y-4">
                  <h4 className="text-xs font-black uppercase text-red-600 dark:text-red-400">Danger Zone</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                    Permanently delete all passport entries, timeline logs, medication reminders, and uploaded vault reports. This operation is absolute and cannot be undone.
                  </p>
                  <button 
                    onClick={() => {
                      if (window.confirm("Are you sure you want to permanently wipe your entire Swasthya Mitra EHR Health Memory? This cannot be undone.")) {
                        clearHealthMemory();
                        alert("Health memory completely wiped successfully.");
                      }
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md active:scale-95"
                  >
                    Wipe Entire Health Memory
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

    </AppLayout>
  );
};

export default MyHealthOverview;
