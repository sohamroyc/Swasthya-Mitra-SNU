import React, { useState, useRef, useEffect } from 'react';
import { generateLocalFallbackResponse, generateSystemPromptFromKB } from '../utils/aiFallback';

const FloatingChatbotProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: 'ai',
            content: "Hello! I'm your AI health assistant. What's on your mind?",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    // Location state
    const [userLocation, setUserLocation] = useState(null); // { city, state, country }
    const locationFetchedRef = useRef(false);

    // Voice Interaction State
    const [isListening, setIsListening] = useState(false);
    const [currentLanguage, setCurrentLanguage] = useState('en-US'); // Default English
    const recognitionRef = useRef(null);

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    // Initialize Speech Recognition
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = true;

            recognitionRef.current.onresult = (event) => {
                const currentTranscript = Array.from(event.results)
                    .map(result => result[0].transcript)
                    .join('');
                setInputValue(currentTranscript);
            };

            recognitionRef.current.onerror = (event) => {
                console.error("Speech recognition error", event.error);
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        } else {
            console.warn("Speech Recognition API is not supported in this browser.");
        }
    }, []);

    // Update language dynamically when user changes it
    useEffect(() => {
        if (recognitionRef.current) {
            recognitionRef.current.lang = currentLanguage;
        }
    }, [currentLanguage]);

    const toggleListening = () => {
        if (!recognitionRef.current) return alert("Speech recognition not supported in this browser. Try Chrome.");

        if (isListening) {
            recognitionRef.current.stop();
        } else {
            setInputValue(''); // Clear old text
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    // Text-to-Speech Function (The App Talking Back)
    const speakText = (text) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel(); // Stop anything currently speaking

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = currentLanguage;

            // Try to find a language-specific voice
            const voices = window.speechSynthesis.getVoices();
            const preferredVoice = voices.find(voice => voice.lang.includes(currentLanguage.split('-')[0]));
            if (preferredVoice) utterance.voice = preferredVoice;

            window.speechSynthesis.speak(utterance);
        }
    };

    const toggleChatbot = () => {
        const opening = !isOpen;
        setIsOpen(opening);

        // Fetch user location the first time the chat is opened
        if (opening && !locationFetchedRef.current) {
            locationFetchedRef.current = true;
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    async (pos) => {
                        try {
                            const { latitude, longitude } = pos.coords;
                            const res = await fetch(
                                `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
                                { headers: { 'Accept-Language': 'en' } }
                            );
                            const geo = await res.json();
                            const addr = geo.address || {};
                            setUserLocation({
                                city: addr.city || addr.town || addr.village || addr.county || 'your city',
                                state: addr.state || '',
                                country: addr.country || 'India',
                            });
                        } catch (_) {
                            // Silently fail — location just won't be injected
                        }
                    },
                    () => { /* permission denied — silently ignore */ },
                    { timeout: 8000 }
                );
            }
        }
    };

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;

        const userMessage = {
            role: 'user',
            content: inputValue,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue("");
        setIsTyping(true);

        try {
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

            if (!apiKey) {
                throw new Error("Gemini API key is not configured.");
            }

            const langMap = { 'en-US': 'English', 'hi-IN': 'Hindi', 'bn-IN': 'Bengali' };
            const languageName = langMap[currentLanguage] || 'English';

            const locationContext = userLocation
                ? `The user is currently located in ${userLocation.city}${userLocation.state ? ', ' + userLocation.state : ''}, ${userLocation.country}. When relevant, suggest nearby hospitals, clinics, emergency numbers, or government health schemes that are applicable to this region.`
                : '';

            const basePrompt = generateSystemPromptFromKB();
            const systemPrompt = `${basePrompt}
${locationContext}
CRITICAL DIRECTIVE: You MUST ONLY answer questions related to the Swasthya Mitra project, health, wellness, first-aid, or medical symptoms. 
If the user asks ANY question unrelated to these topics (such as coding, math, general knowledge, translations of non-medical text, or any out-of-domain topic), you MUST firmly refuse to answer. Do not apologize, just state: "I am a medical assistant and can only answer health-related questions."
Do not prescribe complex medications. Respond natively in ${languageName}, keeping answers extremely short and concise.`;

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                mode: 'cors',
                body: JSON.stringify({
                    systemInstruction: {
                        parts: [{ text: systemPrompt }]
                    },
                    contents: [{
                        role: 'user',
                        parts: [{ text: userMessage.content }]
                    }]
                })
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();
            const aiResponseContent = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't generate a response. Please try again.";

            const aiResponse = {
                role: 'ai',
                content: aiResponseContent,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            setMessages(prev => [...prev, aiResponse]);
            // Speak the response back in the selected language
            speakText(aiResponseContent);

        } catch (error) {
            console.error("Gemini AI integration error:", error);
            
            const fallbackText = generateLocalFallbackResponse(userMessage.content);

            const mockResponse = {
                role: 'ai',
                content: fallbackText,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, mockResponse]);
            speakText(fallbackText);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <>
            {children}

            {/* Floating Chat Window */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 w-80 sm:w-96 min-h-[400px] max-h-[80vh] flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-[9999] overflow-hidden transition-all duration-300 transform origin-bottom-right">

                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-primary text-white">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 h-8 bg-white/20 rounded-full">
                                <span className="material-symbols-outlined text-[18px]">smart_toy</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-sm tracking-wide">Swasthya Mitra AI</span>
                                <span className="text-[10px] text-primary-100 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block"></span> Online
                                </span>
                            </div>
                        </div>
                        <button onClick={toggleChatbot} className="text-white hover:bg-white/20 p-1.5 rounded-lg transition-colors">
                            <span className="material-symbols-outlined text-[20px]">close</span>
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 p-4 overflow-y-auto bg-slate-50 dark:bg-slate-900/50 flex flex-col gap-4">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>

                                    {msg.role === 'ai' && (
                                        <div className="flex-shrink-0 w-8 h-8 bg-white dark:bg-slate-800 text-primary border border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center">
                                            <span className="material-symbols-outlined text-[16px]">smart_toy</span>
                                        </div>
                                    )}

                                    <div className="flex flex-col gap-1">
                                        <div className={`p-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-tl-none shadow-sm'}`}>
                                            {msg.content}
                                        </div>
                                        <span className={`text-[10px] text-slate-400 font-medium px-1 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                                            {msg.timestamp}
                                        </span>
                                    </div>

                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="flex gap-2 max-w-[85%]">
                                    <div className="flex-shrink-0 w-8 h-8 bg-white dark:bg-slate-800 text-primary border border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center">
                                        <span className="material-symbols-outlined text-[16px]">smart_toy</span>
                                    </div>
                                    <div className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1">
                                        <div className="w-1.5 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-1.5 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-1.5 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
                        {/* Language Selector */}
                        <div className="flex justify-between items-center px-1">
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">translate</span>
                                Voice Language
                            </span>
                            <select
                                value={currentLanguage}
                                onChange={(e) => setCurrentLanguage(e.target.value)}
                                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-600 dark:text-slate-300 text-xs rounded-lg focus:ring-primary focus:border-primary px-2 py-1 outline-none cursor-pointer"
                            >
                                <option value="en-US">English</option>
                                <option value="hi-IN">हिंदी (Hindi)</option>
                                <option value="bn-IN">বাংলা (Bengali)</option>
                            </select>
                        </div>

                        <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
                            <button
                                onClick={toggleListening}
                                className={`p-3 shrink-0 transition-colors ${isListening ? 'text-red-500 animate-pulse bg-red-50 dark:bg-red-900/20' : 'text-slate-400 hover:text-primary hover:bg-white dark:hover:bg-slate-700'}`}
                                title={isListening ? "Stop listening" : "Tap to speak"}
                            >
                                <span className="material-symbols-outlined">{isListening ? 'mic' : 'mic_none'}</span>
                            </button>
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder={isListening ? "Listening..." : "Ask me anything..."}
                                className="flex-1 bg-transparent border-none px-2 py-3 text-sm focus:ring-0 text-slate-800 dark:text-white placeholder:text-slate-400"
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={!inputValue.trim()}
                                className="p-3 text-primary disabled:text-slate-400 hover:bg-white dark:hover:bg-slate-700 transition-colors shrink-0"
                            >
                                <span className="material-symbols-outlined">send</span>
                            </button>
                        </div>
                    </div>

                </div>
            )}

            {/* Floating Action Button */}
            <button
                onClick={toggleChatbot}
                className={`fixed bottom-6 right-6 z-[9990] flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-all duration-300 transform ${isOpen ? 'bg-rose-500 hover:bg-rose-600 rotate-90 scale-90' : 'bg-primary hover:bg-primary/95 hover:scale-105 hover:shadow-primary/30'} text-white`}
            >
                <span className="material-symbols-outlined text-3xl">
                    {isOpen ? 'close' : 'smart_toy'}
                </span>
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white"></span>
                    </span>
                )}
            </button>

        </>
    );
};

export default FloatingChatbotProvider;
