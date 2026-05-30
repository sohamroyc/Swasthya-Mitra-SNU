import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import AppLayout from '../components/AppLayout';

const SCHEMES_LIST = [
    {
        id: 'pm-jay',
        title: 'PM-JAY',
        fullTitle: 'Ayushman Bharat PM-JAY',
        tags: ['NATIONAL'],
        description: 'Free health coverage up to ₹5 Lakhs per family per year for secondary and tertiary care.',
        eligibility: ['Listed in the Socio-Economic Caste Census (SECC) 2011 under specific deprivation criteria or active Rashtriya Swasthya Bima Yojana (RSBY) families.', 'No cap on family size or age of members.', 'Priority given to households without a male adult, SC/ST households, and disabled members.'],
        icon: 'verified_user',
        iconBg: 'bg-blue-100 text-blue-600',
        badgeColor: 'bg-blue-100 text-blue-700'
    },
    {
        id: 'jsy',
        title: 'JSY',
        tags: ['MATERNITY'],
        description: 'Financial assistance for institutional delivery to reduce maternal and neonatal mortality.',
        eligibility: ['Pregnant women belonging to Below Poverty Line (BPL) households.', 'Must be aged 19 years or above at the time of delivery.', 'Applicable up to the first two live births.'],
        icon: 'child_care',
        iconBg: 'bg-pink-100 text-pink-600',
        badgeColor: 'bg-pink-100 text-pink-700'
    },
    {
        id: 'cghs',
        title: 'CGHS',
        tags: ['EMPLOYEE'],
        description: 'Comprehensive health scheme for Central Government employees, pensioners and dependents.',
        eligibility: ['All Central Government employees drawing pay from Central Civil Estimates and their dependents.', 'Current and former Members of Parliament and former Judges of Supreme/High Courts.', 'Pensioners drawing pension from Central Civil Estimates.'],
        icon: 'business_center',
        iconBg: 'bg-emerald-100 text-emerald-600',
        badgeColor: 'bg-emerald-100 text-emerald-700'
    },
    {
        id: 'ma-scheme',
        title: 'MA Scheme',
        tags: ['GUJARAT'],
        description: 'Mukhyamantri Amrutam provides tertiary care for BPL families in Gujarat up to ₹3 Lakhs.',
        eligibility: ['Families belonging to the Below Poverty Line (BPL) in Gujarat state.', 'Annual family income must be less than ₹4 lakhs maximum.', 'Must possess an active MA Card issued by the state authorities.'],
        icon: 'location_on',
        iconBg: 'bg-orange-100 text-orange-600',
        badgeColor: 'bg-orange-100 text-orange-700'
    },
    {
        id: 'indradhanush',
        title: 'Indradhanush',
        tags: ['VACCINATION'],
        description: 'Universal immunization coverage for children and pregnant women against 12 diseases.',
        eligibility: ['All children up to 2 years of age who are partially vaccinated or unvaccinated.', 'Pregnant women who have missed out on full immunization drops.', 'Populations residing in high-risk areas with low prior vaccination coverage.'],
        icon: 'vaccines',
        iconBg: 'bg-purple-100 text-purple-600',
        badgeColor: 'bg-purple-100 text-purple-700'
    },
    {
        id: 'pmssy',
        title: 'PMSSY',
        tags: ['INFRA'],
        description: 'Pradhan Mantri Swasthya Suraksha Yojana for correcting regional healthcare imbalances.',
        eligibility: ['Available to the general public indirectly through newly established AIIMS institutions.', 'Aimed at augmenting facilities for quality medical education in underserved regions.', 'State-level government medical colleges receive structural upgrades under this.'],
        icon: 'corporate_fare',
        iconBg: 'bg-cyan-100 text-cyan-600',
        badgeColor: 'bg-cyan-100 text-cyan-700'
    },
    {
        id: 'esic',
        title: 'ESIC',
        tags: ['LABOUR'],
        description: 'Social security and health insurance for Indian workers earning less than ₹21,000/month.',
        eligibility: ['Employees of registered non-seasonal, manufacturing and covered establishments.', 'Must draw a monthly wage up to ₹21,000 (extended to ₹25,000 for persons with disabilities).', 'Healthcare is also extended to direct dependents of the insured employee.'],
        icon: 'groups',
        iconBg: 'bg-amber-100 text-amber-600',
        badgeColor: 'bg-amber-100 text-amber-700'
    },
    {
        id: 'pmbjp',
        title: 'PMBJP',
        tags: ['GENERIC'],
        description: 'Access to quality generic medicines at affordable prices through Jan Aushadhi Kendras.',
        eligibility: ['Universally available to all citizens of India at PMBJP dedicated stores.', 'No specific income restrictions, ID cards, or demographic criteria required.', 'A valid doctor\'s prescription may be required for certain scheduled generic drugs.'],
        icon: 'medication',
        iconBg: 'bg-rose-100 text-rose-600',
        badgeColor: 'bg-rose-100 text-rose-700'
    }
];

const GovernmentHealthSchemes = () => {
    const [selectedScheme, setSelectedScheme] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [agentMessages, setAgentMessages] = useState([
        { role: 'ai', content: "Hello! I'm your dedicated assistant for Ayushman Bharat. Ask me anything about eligibility or documents.", type: 'text' }
    ]);
    const [chatInput, setChatInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const messagesEndRef = useRef(null);
    const rationFileRef = useRef(null);
    const familyFileRef = useRef(null);
    const aadhaarFileRef = useRef(null);

    const [isAiFinderOpen, setIsAiFinderOpen] = useState(false);
    const [aiFinderInput, setAiFinderInput] = useState('');
    const [isFindingSchemes, setIsFindingSchemes] = useState(false);
    const [aiRecommendations, setAiRecommendations] = useState(null);

    const [documents, setDocuments] = useState({
        aadhaar: { status: 'uploaded', name: 'aadhaar_front_back.pdf', size: '1.2 MB' },
        ration: { status: 'pending', name: '', size: '' },
        family: { status: 'pending', name: '', size: '' }
    });

    const handleFileUpload = (docType, e) => {
        const file = e.target.files[0];
        if (file) {
            setDocuments(prev => ({
                ...prev,
                [docType]: {
                    status: 'uploaded',
                    name: file.name,
                    size: (file.size / (1024 * 1024)).toFixed(1) + ' MB'
                }
            }));
        }
    };

    const handleDeleteDoc = (docType) => {
        setDocuments(prev => ({
            ...prev,
            [docType]: { status: 'pending', name: '', size: '' }
        }));
    };

    const uploadedCount = Object.values(documents).filter(d => d.status === 'uploaded').length;

    const filteredSchemes = SCHEMES_LIST.filter(s => {
        if (aiRecommendations) {
            return aiRecommendations.includes(s.id);
        }
        return s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    });

    const handleAiSchemeFinder = async () => {
        if (!aiFinderInput.trim()) return;
        setIsFindingSchemes(true);
        try {
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
            if (!apiKey) {
                // mock response
                setTimeout(() => {
                    setAiRecommendations(['jsy', 'ma-scheme']);
                    setIsFindingSchemes(false);
                    setIsAiFinderOpen(false);
                }, 1500);
                return;
            }

            const promptText = `You are an AI Scheme Finder for Indian Government Health Schemes.
Here are the available schemes:
${SCHEMES_LIST.map(s => `- ${s.id}: ${s.title} - ${s.description}`).join('\n')}

The user says: "${aiFinderInput}"

Based on the user's demographic, income, state, etc., identify which scheme(s) are applicable.
Return ONLY a valid JSON array of the 'id's of the applicable schemes. Do not write markdown blocks or any other text. Avoid extra characters.
Example: ["pm-jay", "jsy"]
`;

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: promptText }] }]
                })
            });

            if (!response.ok) throw new Error("API call failed");

            const data = await response.json();
            const textResponse = data.candidates[0].content.parts[0].text;
            let ids = [];
            try {
                // remove any potential markdown formatting
                const cleanedText = textResponse.replace(/```json/gi, '').replace(/```/g, '').trim();
                ids = JSON.parse(cleanedText);
            } catch (e) {
                console.error("Failed to parse JSON", e);
            }
            if (Array.isArray(ids) && ids.length > 0) {
                setAiRecommendations(ids);
            } else {
                setAiRecommendations([]);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsFindingSchemes(false);
            setIsAiFinderOpen(false);
            setAiFinderInput('');
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (selectedScheme) {
            scrollToBottom();
        }
    }, [agentMessages, selectedScheme]);

    const handleSendMessage = async (e) => {
        e?.preventDefault();
        if (!chatInput.trim() || isThinking) return;

        const userMsg = chatInput.trim();
        setChatInput('');
        setAgentMessages(prev => [...prev, { role: 'user', content: userMsg, type: 'text' }]);
        setIsThinking(true);

        try {
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

            // Mock response if API key isn't setup but we ideally want live AI
            if (!apiKey) {
                setTimeout(() => {
                    setAgentMessages(prev => [...prev, { role: 'ai', content: "Based on PM-JAY criteria, individuals with income up to ₹2.5 Lakh may qualify under certain categories. Let's check your SECC status.", type: 'text' }]);
                    setIsThinking(false);
                }, 1000);
                return;
            }

            const systemPrompt = `You are the "Scheme AI Agent" acting as a helpful guide for Government Health Schemes in India, specifically for ${selectedScheme ? selectedScheme.fullTitle || selectedScheme.title : "Indian Government Schemes"}. 
CRITICAL RULE: You must ONLY answer questions related to health, wellness, the Swasthya Mitra project, or government health schemes. If the query is unrelated (coding, general knowledge), firmly refuse to answer.
Keep your response extremely short, professional, and directly address the user's query about eligibility, documents, or procedure. Use markdown for bolding important parts.`;

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    systemInstruction: { parts: [{ text: systemPrompt }] },
                    contents: [{ parts: [{ text: userMsg }] }]
                })
            });

            if (!response.ok) throw new Error("API call failed");

            const data = await response.json();
            const aiFeedback = data.candidates[0].content.parts[0].text;

            setAgentMessages(prev => [...prev, { role: 'ai', content: aiFeedback, type: 'text' }]);
        } catch (error) {
            setAgentMessages(prev => [...prev, { role: 'ai', content: "I'm currently unable to process your request. Please try again later.", type: 'text' }]);
        } finally {
            setIsThinking(false);
        }
    };

    const handleQuickQuery = (query) => {
        setChatInput(query);
        // Automatically send after small delay to let state update
        setTimeout(() => {
            const tempEvent = { preventDefault: () => { } };
            // Need a tiny hack here as state isn't synchronous so direct call with param is better.
            const syntheticSend = async () => {
                setAgentMessages(prev => [...prev, { role: 'user', content: query, type: 'text' }]);
                setIsThinking(true);

                try {
                    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
                    if (!apiKey) {
                        setTimeout(() => {
                            setAgentMessages(prev => [...prev, { role: 'ai', content: "Based on PM-JAY criteria, individuals with income up to ₹2.5 Lakh may qualify under certain categories. Let's check your SECC status.", type: 'text' }]);
                            setIsThinking(false);
                        }, 1000);
                        return;
                    }
                    const systemPrompt = `You are the Scheme AI Agent for Swasthya Mitra. You MUST answer in short and concise sentences.
CRITICAL RULE: ONLY answer questions related to health, the Swasthya Mitra project, or Indian Government Health Schemes. If the user asks anything else, firmly refuse to answer.`;
                    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            systemInstruction: { parts: [{ text: systemPrompt }] },
                            contents: [{ parts: [{ text: query }] }]
                        })
                    });
                    const data = await response.json();
                    setAgentMessages(prev => [...prev, { role: 'ai', content: data.candidates[0].content.parts[0].text, type: 'text' }]);
                } catch {
                    setAgentMessages(prev => [...prev, { role: 'ai', content: "Error fetching answer.", type: 'text' }]);
                } finally {
                    setIsThinking(false);
                }
            };
            syntheticSend();
        }, 10);
    };

    if (selectedScheme) {
        return (
            <AppLayout activeTab="schemes">
                <div className="max-w-7xl mx-auto px-4 mt-6">
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-6 uppercase tracking-wider">
                        <span className="cursor-pointer hover:text-blue-600 transition-colors" onClick={() => setSelectedScheme(null)}>Schemes</span>
                        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                        <span className="text-slate-900">{selectedScheme.fullTitle || selectedScheme.title}</span>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Main Content Area */}
                        <div className="flex-1 space-y-6">
                            {/* Header details */}
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    {selectedScheme.tags.map(tag => (
                                        <span key={tag} className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded uppercase font-black tracking-widest">{tag} SCHEME</span>
                                    ))}
                                    <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded uppercase font-black tracking-widest">ACTIVE STATUS</span>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">{selectedScheme.fullTitle || selectedScheme.title}</h1>
                                        <p className="text-slate-600 font-medium text-lg mt-1">{selectedScheme.description}</p>
                                    </div>
                                    <div className="flex gap-3 shrink-0">
                                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-bold text-sm">
                                            <span className="material-symbols-outlined text-[18px]">download</span>
                                            Brochure
                                        </button>
                                        <button className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-bold text-sm shadow-md shadow-blue-600/20">
                                            Start New Application
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Eligibility Criteria */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                    <h3 className="text-lg font-black text-slate-900">Eligibility Criteria</h3>
                                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">Auto-Verified</span>
                                </div>
                                <div className="p-6">
                                    <ul className="space-y-4">
                                        {selectedScheme.eligibility?.map((criterion, idx) => (
                                            <li key={idx} className="flex items-start gap-4">
                                                <div className="size-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                                                    <span className="material-symbols-outlined text-[14px]">check</span>
                                                </div>
                                                <p className="text-sm text-slate-700 font-medium leading-relaxed">{criterion}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Application Progress */}
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                <h3 className="text-xs font-bold text-slate-400 mb-6 uppercase tracking-widest">Application Progress</h3>
                                <div className="relative flex justify-between">
                                    <div className="absolute top-[18px] left-8 right-8 h-0.5 bg-slate-200 z-0">
                                        <div className="h-full bg-blue-600" style={{ width: '33%' }}></div>
                                    </div>

                                    <div className="flex flex-col items-center gap-2 z-10">
                                        <div className="size-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
                                            <span className="material-symbols-outlined text-[20px]">check</span>
                                        </div>
                                        <span className="text-xs font-bold text-slate-900">Eligibility</span>
                                    </div>

                                    <div className="flex flex-col items-center gap-2 z-10">
                                        <div className="size-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md ring-4 ring-blue-50">
                                            <span className="material-symbols-outlined text-[20px]">description</span>
                                        </div>
                                        <span className="text-xs font-bold text-slate-900">Documents</span>
                                    </div>

                                    <div className="flex flex-col items-center gap-2 z-10">
                                        <div className="size-10 rounded-full bg-white border-2 border-slate-200 text-slate-400 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-[20px]">verified_user</span>
                                        </div>
                                        <span className="text-xs font-bold text-slate-400">Verification</span>
                                    </div>

                                    <div className="flex flex-col items-center gap-2 z-10">
                                        <div className="size-10 rounded-full bg-white border-2 border-slate-200 text-slate-400 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-[20px]">credit_card</span>
                                        </div>
                                        <span className="text-xs font-bold text-slate-400">Issuance</span>
                                    </div>
                                </div>
                            </div>

                            {/* Required Documents */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                                    <h3 className="text-lg font-black text-slate-900">Required Documents</h3>
                                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{uploadedCount} of 3 uploaded</span>
                                </div>
                                <div className="p-6 space-y-4">
                                    {/* Aadhaar Card */}
                                    {documents.aadhaar.status === 'uploaded' ? (
                                        <div className="flex items-center justify-between p-4 border border-emerald-100 bg-emerald-50/30 rounded-xl">
                                            <div className="flex items-center gap-4">
                                                <div className="size-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                                                    <span className="material-symbols-outlined">description</span>
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-sm text-slate-900">Aadhaar Card / ID Proof</h4>
                                                    <p className="text-xs text-slate-500 font-medium">{documents.aadhaar.name} ({documents.aadhaar.size})</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="material-symbols-outlined text-emerald-500 text-[20px]">task_alt</span>
                                                <span onClick={() => handleDeleteDoc('aadhaar')} className="material-symbols-outlined text-slate-400 hover:text-red-500 cursor-pointer text-[20px]">delete</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between p-4 border border-slate-200 border-dashed rounded-xl hover:border-blue-300 transition-colors bg-slate-50/50">
                                            <div className="flex items-center gap-4">
                                                <div className="size-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                                                    <span className="material-symbols-outlined">badge</span>
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-sm text-slate-900">Aadhaar Card / ID Proof</h4>
                                                    <p className="text-xs text-slate-500 font-medium">Max size 5MB. PDF or JPG.</p>
                                                </div>
                                            </div>
                                            <input type="file" className="hidden" ref={aadhaarFileRef} onChange={(e) => handleFileUpload('aadhaar', e)} />
                                            <button onClick={() => aadhaarFileRef.current?.click()} className="px-4 py-1.5 text-xs font-bold text-blue-600 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
                                                Upload File
                                            </button>
                                        </div>
                                    )}

                                    {/* Ration Card */}
                                    {documents.ration.status === 'uploaded' ? (
                                        <div className="flex items-center justify-between p-4 border border-emerald-100 bg-emerald-50/30 rounded-xl">
                                            <div className="flex items-center gap-4">
                                                <div className="size-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                                                    <span className="material-symbols-outlined">receipt_long</span>
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-sm text-slate-900">Ration Card / Income Certificate</h4>
                                                    <p className="text-xs text-slate-500 font-medium">{documents.ration.name} ({documents.ration.size})</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="material-symbols-outlined text-emerald-500 text-[20px]">task_alt</span>
                                                <span onClick={() => handleDeleteDoc('ration')} className="material-symbols-outlined text-slate-400 hover:text-red-500 cursor-pointer text-[20px]">delete</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between p-4 border border-slate-200 border-dashed rounded-xl hover:border-blue-300 transition-colors bg-slate-50/50">
                                            <div className="flex items-center gap-4">
                                                <div className="size-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                                                    <span className="material-symbols-outlined">receipt_long</span>
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-sm text-slate-900">Ration Card / Income Certificate</h4>
                                                    <p className="text-xs text-slate-500 font-medium">Max size 5MB. PDF or JPG.</p>
                                                </div>
                                            </div>
                                            <input type="file" className="hidden" ref={rationFileRef} onChange={(e) => handleFileUpload('ration', e)} />
                                            <button onClick={() => rationFileRef.current?.click()} className="px-4 py-1.5 text-xs font-bold text-blue-600 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
                                                Upload File
                                            </button>
                                        </div>
                                    )}

                                    {/* Family Declaration Form */}
                                    {documents.family.status === 'uploaded' ? (
                                        <div className="flex items-center justify-between p-4 border border-emerald-100 bg-emerald-50/30 rounded-xl">
                                            <div className="flex items-center gap-4">
                                                <div className="size-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                                                    <span className="material-symbols-outlined">family_history</span>
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-sm text-slate-900">Family Declaration Form</h4>
                                                    <p className="text-xs text-slate-500 font-medium">{documents.family.name} ({documents.family.size})</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="material-symbols-outlined text-emerald-500 text-[20px]">task_alt</span>
                                                <span onClick={() => handleDeleteDoc('family')} className="material-symbols-outlined text-slate-400 hover:text-red-500 cursor-pointer text-[20px]">delete</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between p-4 border border-slate-200 border-dashed rounded-xl hover:border-blue-300 transition-colors bg-slate-50/50">
                                            <div className="flex items-center gap-4">
                                                <div className="size-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                                                    <span className="material-symbols-outlined">family_history</span>
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-sm text-slate-900">Family Declaration Form</h4>
                                                    <p className="text-xs text-slate-500 font-medium hover:text-blue-600 cursor-pointer underline decoration-blue-200">Download template and sign.</p>
                                                </div>
                                            </div>
                                            <input type="file" className="hidden" ref={familyFileRef} onChange={(e) => handleFileUpload('family', e)} />
                                            <button onClick={() => familyFileRef.current?.click()} className="px-4 py-1.5 text-xs font-bold text-blue-600 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
                                                Upload File
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Map Area */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                                    <div>
                                        <h3 className="text-lg font-black text-slate-900">Nearest Empaneled Hospitals</h3>
                                        <p className="text-sm text-slate-500 font-medium">Showing 12 facilities near your location.</p>
                                    </div>
                                    <button className="text-sm font-bold text-blue-600 hover:text-blue-700">View All</button>
                                </div>
                                <div className="h-[280px] bg-slate-100 relative flex items-center justify-center group overflow-hidden">
                                    {/* Abstract map lines */}
                                    <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #cbd5e1 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
                                    <div className="absolute w-full h-[150%] left-[-20%] top-[-20%] rotate-12 border-t-[40px] border-white/50 blur-[2px]"></div>
                                    <div className="absolute w-full h-[150%] left-[10%] top-[-30%] -rotate-6 border-t-[80px] border-white/50 blur-[2px]"></div>

                                    {/* Map Card */}
                                    <div className="relative z-10 bg-white p-5 rounded-2xl shadow-xl shadow-slate-200 border border-slate-100 text-center transform group-hover:scale-105 transition-transform">
                                        <div className="size-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-3 outline outline-4 outline-white shadow-sm">
                                            <span className="material-symbols-outlined text-[20px]">location_on</span>
                                        </div>
                                        <h4 className="font-black text-slate-900">Apollo Medical Center</h4>
                                        <p className="text-[10px] text-slate-500 font-bold mb-4 uppercase tracking-widest mt-1">2.4 km away • 24/7 PMJAY Desk</p>
                                        <button className="w-full py-2 bg-blue-600 text-white rounded-lg font-bold text-sm shadow-md hover:bg-blue-700 transition-colors">
                                            Get Directions
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Sidebar Area */}
                        <div className="w-full lg:w-[380px] shrink-0 space-y-6">
                            {/* Scheme AI Agent */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[400px]">
                                <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
                                    <div className="size-10 rounded-full bg-blue-600 flex flex-shrink-0 items-center justify-center text-white relative shadow-md">
                                        <span className="material-symbols-outlined text-[20px]">smart_toy</span>
                                        <span className="absolute bottom-0 right-0 size-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 leading-tight">Scheme AI Agent</h3>
                                        <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mt-0.5">ONLINE • INSTANT SUPPORT</p>
                                    </div>
                                </div>
                                <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/30">
                                    {agentMessages.map((msg, i) => (
                                        <div key={i} className={`flex ${msg.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
                                            <div className={`max-w-[85%] rounded-2xl p-3 text-sm ${msg.role === 'ai'
                                                ? 'bg-white border border-slate-200 text-slate-700 shadow-sm rounded-tl-sm'
                                                : 'bg-blue-600 text-white shadow-md shadow-blue-600/20 rounded-tr-sm'
                                                }`}>
                                                {msg.role === 'ai' && msg.content === "Based on PM-JAY criteria, individuals with income up to ₹2.5 Lakh may qualify under certain categories. Let's check your SECC status." ? (
                                                    <div>Based on PM-JAY criteria, individuals with income up to ₹2.5 Lakh may qualify under certain categories. Let's check your SECC status.</div>
                                                ) : (
                                                    <div className={`prose prose-sm max-w-none ${msg.role === 'user' ? 'text-white' : 'text-slate-700'}`}>
                                                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {isThinking && (
                                        <div className="flex justify-start">
                                            <div className="bg-white border text-sm border-slate-200 text-slate-500 shadow-sm rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1 items-center">
                                                <div className="size-1.5 bg-blue-600 rounded-full animate-bounce"></div>
                                                <div className="size-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                                                <div className="size-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                <div className="p-3 border-t border-slate-100 bg-white space-y-3">
                                    {!chatInput && agentMessages.length < 2 && (
                                        <div className="flex gap-2">
                                            <button onClick={() => handleQuickQuery('Am I eligible if my annual income is ₹1.5 Lakh?')} className="bg-blue-600 text-white text-[11px] font-bold px-3 py-2 rounded-lg hover:bg-blue-700 cursor-pointer text-left block flex-1 break-words">
                                                Am I eligible if my annual income is ₹1.5 Lakh?
                                            </button>
                                        </div>
                                    )}
                                    <form onSubmit={handleSendMessage} className="relative">
                                        <input
                                            value={chatInput}
                                            onChange={e => setChatInput(e.target.value)}
                                            type="text"
                                            placeholder="Ask a question..."
                                            className="w-full bg-slate-50 border border-slate-200 text-sm rounded-xl pl-4 pr-12 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                        />
                                        <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-700 p-1 bg-white rounded-lg shadow-sm border border-slate-100 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-[20px]">send</span>
                                        </button>
                                    </form>
                                    <div className="flex gap-2 overflow-x-auto invisible-scrollbar pb-1">
                                        <button onClick={() => handleQuickQuery("What documents are needed?")} className="shrink-0 text-[10px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full whitespace-nowrap hover:bg-slate-200">List Documents</button>
                                        <button onClick={() => handleQuickQuery("How to track status?")} className="shrink-0 text-[10px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full whitespace-nowrap hover:bg-slate-200">Track Status</button>
                                    </div>
                                </div>
                            </div>

                            {/* Helpdesk Area */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Helpdesk & Support</h3>
                                <div className="flex items-center gap-4">
                                    <div className="size-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                                        <span className="material-symbols-outlined">call</span>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-slate-500 tracking-wider mb-0.5">Toll-Free Helpline</p>
                                        <p className="font-bold text-blue-600">14555 / 1800 111 565</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="size-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                                        <span className="material-symbols-outlined">mail</span>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-slate-500 tracking-wider mb-0.5">Email Support</p>
                                        <p className="font-bold text-slate-900">support.pmjay@gov.in</p>
                                    </div>
                                </div>
                                <button className="w-full py-2.5 text-sm font-bold border-2 border-slate-100 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors">
                                    Read FAQs
                                </button>
                            </div>

                            {/* Info Box */}
                            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex gap-4">
                                <span className="material-symbols-outlined text-amber-500">info</span>
                                <p className="text-xs text-amber-700 font-medium leading-relaxed">
                                    Swasthya Mitra acts as a facilitator for government schemes. Eligibility and final approval are subject to government verification and policy changes.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout activeTab="schemes">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-20 text-center">
                <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 font-bold text-xs px-3 py-1 rounded-full uppercase tracking-widest mb-6">
                    <span className="material-symbols-outlined text-[14px]">verified</span>
                    Government Trusted
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">Government Health Schemes</h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed mb-10">
                    Discover and enroll in national and state healthcare programs tailored to your needs with AI-powered matching.
                </p>

                {aiRecommendations && (
                    <div className="max-w-4xl mx-auto mb-6 bg-emerald-50 text-emerald-700 p-4 rounded-xl flex items-center justify-between shadow-sm border border-emerald-100">
                        <div className="flex items-center gap-3 text-left">
                            <span className="material-symbols-outlined text-2xl">auto_awesome</span>
                            <div>
                                <span className="font-bold block">AI Found {aiRecommendations.length} scheme(s) tailored for you!</span>
                                <span className="text-sm">Based on your provided demographic profile.</span>
                            </div>
                        </div>
                        <button onClick={() => setAiRecommendations(null)} className="text-sm font-bold bg-white px-4 py-2 rounded-lg shadow-sm hover:bg-emerald-100 transition-colors border border-emerald-200">Clear Matches</button>
                    </div>
                )}

                {/* Search Bar Area */}
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-4 mb-12">
                    <div className="flex-1 relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                        <input
                            value={searchQuery}
                            onChange={e => { setSearchQuery(e.target.value); setAiRecommendations(null); }}
                            type="text"
                            className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900 placeholder-slate-400 font-medium"
                            placeholder="Search by State or Benefit (e.g. 'Maternity', 'Karnataka')"
                        />
                    </div>
                    <button onClick={() => setIsAiFinderOpen(true)} className="flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md shadow-blue-600/20 transition-all shrink-0">
                        <span className="material-symbols-outlined">auto_awesome</span>
                        AI Scheme Finder
                    </button>
                    <button onClick={() => { setSearchQuery(''); setAiRecommendations(null); }} className="flex items-center justify-center gap-2 px-6 py-4 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-bold shadow-sm shrink-0">
                        <span className="material-symbols-outlined">restart_alt</span>
                        Reset
                    </button>
                </div>

                {/* Schemes Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left mb-16 max-w-7xl mx-auto">
                    {filteredSchemes.map((scheme) => (
                        <div key={scheme.id} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
                            <div className="flex justify-between items-start mb-6">
                                <div className={`size-12 rounded-2xl ${scheme.iconBg} flex items-center justify-center shadow-inner`}>
                                    <span className="material-symbols-outlined">{scheme.icon}</span>
                                </div>
                                {scheme.tags[0] === 'MATERNITY' ? (
                                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded bg-pink-50 text-pink-700`}>{scheme.tags[0]}</span>
                                ) : (
                                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded ${scheme.badgeColor}`}>{scheme.tags[0]}</span>
                                )}
                            </div>
                            <h3 className="text-xl font-black mb-2 text-slate-900">{scheme.title}</h3>
                            <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6 flex-1">
                                {scheme.description}
                            </p>
                            <button onClick={() => setSelectedScheme(scheme)} className="w-full text-center py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md transition-colors mt-auto tracking-wide">
                                Check Eligibility
                            </button>
                        </div>
                    ))}
                    {filteredSchemes.length === 0 && (
                        <div className="col-span-full py-12 text-center text-slate-500 font-medium">
                            No schemes found matching "{searchQuery}"
                        </div>
                    )}
                </div>

                {/* Bottom info banner */}
                <div className="max-w-5xl mx-auto bg-slate-50 border border-slate-200 rounded-2xl p-6 flex items-start gap-4 text-left">
                    <div className="size-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md">
                        <span className="material-symbols-outlined text-[18px]">info</span>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 mb-1">Scheme Finder Information</h4>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium">
                            The AI Scheme Finder matches your demographic profile (Age, State, Income, Occupation) with eligible programs using official National Health Portal (NHP) repositories. Always cross-verify final eligibility criteria on respective official government portals before applying.
                        </p>
                    </div>
                </div>
            </div>

            {/* AI Scheme Finder Modal */}
            {isAiFinderOpen && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl relative">
                        <div className="absolute top-4 right-4">
                            <button onClick={() => setIsAiFinderOpen(false)} className="text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full p-1 transition-colors">
                                <span className="material-symbols-outlined text-lg block">close</span>
                            </button>
                        </div>
                        <div className="flex items-center gap-3 mb-2 mt-2">
                            <div className="size-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined">auto_awesome</span>
                            </div>
                            <h3 className="text-xl font-black text-slate-900">AI Scheme Finder</h3>
                        </div>
                        <p className="text-sm text-slate-500 mb-5 font-medium">
                            Describe your demographic profile, and our AI will comb through all active government schemes to find the best fit for your needs.
                        </p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Your Profile</label>
                                <textarea
                                    value={aiFinderInput}
                                    onChange={(e) => setAiFinderInput(e.target.value)}
                                    placeholder="e.g., 'I am a 28-year-old pregnant woman in Gujarat earning 1.5 lakh annually.'"
                                    className="w-full h-32 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none text-sm text-slate-800"
                                ></textarea>
                            </div>

                            <button
                                onClick={handleAiSchemeFinder}
                                disabled={isFindingSchemes || !aiFinderInput.trim()}
                                className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-md shadow-blue-600/20"
                            >
                                {isFindingSchemes ? (
                                    <>
                                        <span className="animate-spin material-symbols-outlined">refresh</span>
                                        Analyzing Schemes...
                                    </>
                                ) : (
                                    "Find Eligible Schemes"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
};

export default GovernmentHealthSchemes;
