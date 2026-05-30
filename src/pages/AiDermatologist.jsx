import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import ReactMarkdown from 'react-markdown';

const AiDermatologist = () => {
    const [messages, setMessages] = useState([
        { id: 1, sender: 'ai', time: '10:42 AM', text: "Hello! I'm your AI Dermatology Assistant. Please upload a photo of the area of concern, or tell me about any symptoms you're experiencing." }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    // File Upload State
    const [selectedImageFile, setSelectedImageFile] = useState(null);
    const [selectedImagePreview, setSelectedImagePreview] = useState(null);
    const fileInputRef = useRef(null);
    const chatEndRef = useRef(null);

    // Insight State
    const [diagnosisState, setDiagnosisState] = useState({
        condition: 'Waiting for upload...',
        score: 0
    });

    // Auto-scroll chat
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImageFile(file);
            setSelectedImagePreview(URL.createObjectURL(file));
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const removeSelectedImage = () => {
        setSelectedImageFile(null);
        setSelectedImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleSendMessage = async (e) => {
        if (e) e.preventDefault();

        const currentInput = inputValue;
        if (!currentInput.trim() && !selectedImageFile) return;

        // 1. Add user message
        const newMessage = {
            id: Date.now(),
            sender: 'user',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            text: currentInput || "Please analyze this image.",
            image: selectedImagePreview // Render in chat
        };

        setMessages(prev => [...prev, newMessage]);
        setInputValue('');
        setIsTyping(true);

        // Keep local ref before flushing state to avoid UI flash
        const fileToAnalyze = selectedImageFile;
        setSelectedImageFile(null);
        setSelectedImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";

        try {
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
            if (!apiKey) throw new Error("API Key missing");

            const systemInstructionText = `You are Dr. Derma AI, an expert clinical dermatologist assistant for the Swasthya Mitra project. 
CRITICAL RULE: You must ONLY answer questions related to dermatology, skin conditions, health, or the Swasthya Mitra app. If a user asks anything unrelated (translation, math, coding, general questions), politely refuse to answer. If an image is provided that is NOT related to human skin or medical symptoms (e.g. a car, an animal, a landscape), you MUST refuse to analyze it. In this case, set "chatMessage" to "I can only answer questions or analyze images related to human skin, dermatology, or this app. Please ask a relevant question or upload a skin photo.", set "topCondition" to "Irrelevant Topic", and "confidenceScore" to 0. Do NOT proceed with the rest of the instructions.
If the image IS related to skin or symptoms, analyze the visible condition.
Your detailed conversational reply should be formatted using Markdown. Keep your reply EXTREMELY short, concise, and directly to the point (maximum 3 sentences or a brief bulleted list). No long-winded explanations.
Provide a preliminary assessment, possible conditions, and recommended next steps.
Always include a medical disclaimer that you are an AI and they should see a doctor.
Return the response ONLY in a valid JSON object structure containing exactly these three keys: 
{"chatMessage": "your extremely concise conversational reply formatted with Markdown", "topCondition": "Most likely issue name (e.g. Contact Dermatitis)", "confidenceScore": number from 1 to 100}
Ensure there are absolutely NO markdown formatting blocks like \`\`\`json wrappers mapping the overall response. Just return the raw JSON object string.`;

            const parts = [{ text: `Analyze the patient's symptoms: "${currentInput}".` }];

            if (fileToAnalyze) {
                const base64Image = await fileToBase64(fileToAnalyze);
                parts.push({
                    inlineData: {
                        mimeType: fileToAnalyze.type,
                        data: base64Image
                    }
                });
            }

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    systemInstruction: {
                        parts: [{ text: systemInstructionText }]
                    },
                    contents: [{ parts }]
                })
            });

            if (!response.ok) throw new Error("API Error");

            const data = await response.json();
            let aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

            // Safety scrub for markdown wrappers just in case
            aiText = aiText.replace(/```json/g, '').replace(/```/g, '').trim();
            const parsedData = JSON.parse(aiText);

            setMessages(prev => [...prev, {
                id: Date.now(),
                sender: 'ai',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                text: parsedData.chatMessage || "I've analyzed the data."
            }]);

            if (parsedData.topCondition) {
                setDiagnosisState({
                    condition: parsedData.topCondition,
                    score: parsedData.confidenceScore || 0
                });
            }

        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, {
                id: Date.now(),
                sender: 'ai',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                text: "I'm sorry, I'm having trouble connecting to the medical AI network right now. Please try again."
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    const quickChips = ["Common Rash", "Acne / Pimples", "Mole Check", "Dry Skin"];

    return (
        <AppLayout activeTab="dermatologist">
            <div className="flex flex-col xl:flex-row gap-8 w-full">

                {/* Left Side Info / Upload Column */}
                <div className="flex-1 w-full min-w-0 xl:max-w-[500px] flex flex-col gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">health_and_safety</span>
                                Clinical Analysis System
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">AI Dermatologist</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">Upload an image for an instant preliminary skin assessment.</p>
                    </div>

                    {/* Analysis Input Box */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 mt-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-slate-900 dark:text-white">Analysis Input</h3>
                            <button onClick={handleUploadClick} className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-lg transition-colors">
                                <span className="material-symbols-outlined text-[20px]">add_a_photo</span>
                            </button>
                        </div>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            ref={fileInputRef}
                            className="hidden"
                        />

                        {!selectedImagePreview ? (
                            <div onClick={handleUploadClick} className="border-2 border-dashed border-blue-200 dark:border-blue-900/30 bg-blue-50/30 dark:bg-blue-900/10 rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors hover:bg-blue-50/60 cursor-pointer">
                                <div className="w-12 h-12 bg-white dark:bg-slate-800 text-blue-600 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-center mb-4">
                                    <span className="material-symbols-outlined text-2xl">upload_file</span>
                                </div>
                                <h4 className="font-black text-slate-900 dark:text-white mb-2">Upload Skin Image</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 max-w-[250px] font-medium leading-relaxed">Click to upload a clear photo of the affected area for instant Gemini analysis.</p>
                                <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2.5 px-6 rounded-lg transition-colors shadow-lg shadow-blue-500/20 active:scale-95 text-sm">
                                    Select Image
                                </button>
                            </div>
                        ) : (
                            <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col items-center relative overflow-hidden group">
                                <img src={selectedImagePreview} alt="Selected skin context" className="w-full h-48 object-cover rounded-lg mb-4" />
                                <button onClick={removeSelectedImage} className="absolute top-6 right-6 bg-red-500 text-white p-1.5 rounded-full shadow-lg hover:bg-red-600 transition-colors">
                                    <span className="material-symbols-outlined text-[16px]">close</span>
                                </button>
                                <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-lg w-full justify-center">
                                    <span className="material-symbols-outlined text-[18px] text-emerald-500">check_circle</span>
                                    Image Attached to Prompt
                                </div>
                            </div>
                        )}
                    </div>

                    {/* AI Insight Box */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-6">AI Insight</h3>

                        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-800 mb-6">
                            <div className="flex justify-between items-center text-sm mb-3">
                                <span className="font-bold text-slate-600 dark:text-slate-300">Diagnosis Confidence</span>
                                <span className={`font-bold ${diagnosisState.score > 0 ? 'text-blue-600' : 'text-slate-400'}`}>
                                    {diagnosisState.condition} {diagnosisState.score > 0 && `(${diagnosisState.score}%)`}
                                </span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden transition-all duration-1000">
                                <div
                                    className={`h-full rounded-full transition-all duration-1000 ${diagnosisState.score > 75 ? 'bg-emerald-500' : diagnosisState.score > 40 ? 'bg-amber-500' : diagnosisState.score > 0 ? 'bg-blue-500' : 'bg-slate-300'}`}
                                    style={{ width: `${diagnosisState.score > 0 ? diagnosisState.score : 5}%` }}
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                            <span className="material-symbols-outlined text-[20px] text-blue-500 shrink-0">info</span>
                            <p className="text-xs font-medium leading-relaxed pr-2">For accurate results, ensure the photo is taken in bright, natural light without shadows. This AI diagnosis is for informational purposes only and is not a substitute for professional medical advice.</p>
                        </div>
                    </div>

                    {/* Bottom Action Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-blue-200 transition-colors cursor-pointer">
                            <div className="mb-4">
                                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-2">Skin Care Tips</h4>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">Daily routines and preventive measures tailored for you.</p>
                            </div>
                            <Link to="/health-reports-analytics" className="text-blue-600 font-bold text-[11px] flex items-center gap-1 hover:underline mt-auto">
                                Explore personalized tips <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                            </Link>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-blue-200 transition-colors cursor-pointer" onClick={() => window.location.href = '/first-aid-knowledge-base'}>
                            <div className="mb-4">
                                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-2">Consult a Human</h4>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">Connect with dermatologists for a second opinion.</p>
                            </div>
                            <button className="bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold py-2 px-3 rounded-lg text-[11px] w-full flex items-center justify-center gap-1 transition-colors border border-slate-200 dark:border-slate-700 active:scale-95 mt-auto">
                                <span className="material-symbols-outlined text-[14px]">video_call</span> Book Video Call
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Side Chat Interface */}
                <div className="flex-1 w-full flex flex-col bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md overflow-hidden relative min-h-[600px] xl:min-h-0">
                    {/* Chat Header */}
                    <div className="bg-white dark:bg-slate-900 p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 z-10 relative">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="size-10 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center shadow-sm border border-blue-200 dark:border-blue-800">
                                    <span className="material-symbols-outlined text-[20px]">medical_services</span>
                                </div>
                                <div className="absolute top-0 right-0 size-2.5 bg-emerald-500 border-2 border-white rounded-full"></div>
                            </div>
                            <div>
                                <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-base">
                                    Dr. Derma AI
                                </h2>
                                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5 tracking-wide">Clinical Assistant</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="hidden sm:flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 uppercase tracking-widest mr-4">
                                <div className="size-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                                Dr. Derma AI is Online
                            </span>
                        </div>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 p-6 overflow-y-auto bg-slate-50/50 dark:bg-slate-900/40 flex flex-col gap-6 scroll-smooth">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} gap-4 group`}>
                                {msg.sender === 'ai' && (
                                    <div className="size-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center shrink-0 shadow-sm border border-blue-200 dark:border-blue-800 mt-1">
                                        <span className="material-symbols-outlined text-[16px]">smart_toy</span>
                                    </div>
                                )}

                                <div className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} max-w-[85%]`}>
                                    <div className={`p-4 rounded-2xl shadow-sm text-[13.5px] font-medium leading-relaxed ${msg.sender === 'user'
                                        ? 'bg-slate-800 text-white rounded-tr-sm border border-transparent'
                                        : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-tl-sm'
                                        }`}>
                                        {msg.image && (
                                            <img src={msg.image} alt="User upload" className="w-48 h-32 object-cover rounded-lg mb-2 border-2 border-white/20" />
                                        )}
                                        {msg.sender === 'ai' ? (
                                            <div className="prose prose-sm prose-slate dark:prose-invert max-w-none prose-p:leading-relaxed prose-p:my-2 prose-ul:my-2 prose-li:my-0.5 text-slate-700 dark:text-slate-300">
                                                <ReactMarkdown>
                                                    {msg.text}
                                                </ReactMarkdown>
                                            </div>
                                        ) : (
                                            <span className="whitespace-pre-wrap">{msg.text}</span>
                                        )}
                                    </div>
                                    <span className={`text-[10px] font-bold text-slate-400 mt-2 px-1 opacity-0 group-hover:opacity-100 transition-opacity ${msg.sender === 'user' ? 'text-right' : ''}`}>
                                        {msg.time}
                                    </span>

                                    {/* Sub-chips for AI message natively placed */}
                                    {msg.id === 1 && (
                                        <div className="flex flex-wrap gap-2 mt-4 ml-1">
                                            {quickChips.map((chip, idx) => (
                                                <button key={idx} onClick={() => setInputValue(chip)} className="bg-white dark:bg-slate-800 border text-blue-600 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/50 px-4 py-1.5 rounded-full text-[12px] font-bold transition-colors shadow-sm active:scale-95">
                                                    {chip}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex justify-start gap-4">
                                <div className="size-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-800 mt-1 text-slate-400">
                                    <span className="material-symbols-outlined text-[16px]">smart_toy</span>
                                </div>
                                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1 shadow-sm">
                                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} className="h-1" />
                    </div>

                    {/* Chat Input */}
                    <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 border-t border-slate-100 dark:border-slate-800 z-10 shrink-0">
                        {selectedImagePreview && (
                            <div className="absolute bottom-[90px] left-6 right-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg rounded-xl p-3 flex items-center gap-3 animate-fade-in-up">
                                <img src={selectedImagePreview} alt="Preview" className="w-12 h-12 object-cover rounded-md" />
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Image ready to send</p>
                                    <p className="text-[10px] text-slate-400">Gemini will analyze this photo.</p>
                                </div>
                                <button type="button" onClick={removeSelectedImage} className="text-slate-400 hover:text-red-500 bg-slate-100 hover:bg-red-50 dark:hover:bg-red-900/30 p-2 rounded-lg transition-colors">
                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                </button>
                            </div>
                        )}
                        <form onSubmit={handleSendMessage} className="relative flex items-end bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-inner-sm transition-shadow focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-400 overflow-hidden">
                            <button type="button" onClick={handleUploadClick} className={`p-4 transition-colors shrink-0 outline-none ${selectedImagePreview ? 'text-blue-500 bg-blue-50' : 'text-slate-400 hover:text-blue-500'}`}>
                                <span className="material-symbols-outlined">add_a_photo</span>
                            </button>
                            <textarea
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage(e);
                                    }
                                }}
                                className="flex-1 max-h-32 min-h-[56px] bg-transparent border-none py-4 px-2 outline-none resize-none font-medium text-slate-700 dark:text-slate-300 placeholder:text-slate-400"
                                placeholder={selectedImagePreview ? "Add optional context to your image..." : "Type your symptoms here..."}
                                rows="1"
                             />
                            <div className="p-2 shrink-0 self-end">
                                <button type="submit" disabled={(!inputValue.trim() && !selectedImageFile) || isTyping} className="w-10 h-10 bg-[#1a85ed] disabled:bg-slate-300 disabled:shadow-none hover:bg-blue-600 text-white rounded-xl shadow-md shadow-blue-500/30 flex items-center justify-center transition-all disabled:cursor-not-allowed">
                                    <span className="material-symbols-outlined text-[20px] ml-0.5">send</span>
                                </button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </AppLayout>
    );
};

export default AiDermatologist;
