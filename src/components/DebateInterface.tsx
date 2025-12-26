'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Message, Difficulty } from '@/types';

interface DebateInterfaceProps {
    topic: string;
    position: string;
    difficulty: Difficulty;
    timeLimit: number;
    onFinish: (messages: Message[]) => void;
}

interface SpeechRecognitionEvent extends Event {
    results: {
        [index: number]: {
            [index: number]: {
                transcript: string;
            };
        };
    };
}

interface SpeechRecognitionErrorEvent extends Event {
    error: string;
}

interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    onstart: () => void;
    onend: () => void;
    onerror: (event: SpeechRecognitionErrorEvent) => void;
    onresult: (event: SpeechRecognitionEvent) => void;
    start: () => void;
    stop: () => void;
}

declare global {
    interface Window {
        SpeechRecognition: {
            new(): SpeechRecognition;
        };
        webkitSpeechRecognition: {
            new(): SpeechRecognition;
        };
    }
}

export default function DebateInterface({ topic, position, difficulty, timeLimit, onFinish }: DebateInterfaceProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [timeLeft, setTimeLeft] = useState(timeLimit * 60);
    const scrollRef = useRef<HTMLDivElement>(null);
    const hasStarted = useRef(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const speakText = useCallback((text: string) => {
        if (!text) return;

        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = (event: SpeechSynthesisErrorEvent) => {
            if (event.error !== 'interrupted' && event.error !== 'canceled') {
                console.error('SpeechSynthesis error:', event.error);
            }
            setIsSpeaking(false);
        };

        const cleanText = text.replace(/[*#_`]/g, '').trim();
        utterance.text = cleanText;

        if (cleanText.length > 0) {
            window.speechSynthesis.speak(utterance);
        }
    }, [setIsSpeaking]);

    const getAIResponse = useCallback(async (history: Message[]) => {
        setIsTyping(true);
        try {
            const response = await fetch('/api/debate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: history, difficulty }),
            });
            const data = await response.json();
            const aiMessage = data.content;

            setMessages(prev => [...prev, { role: 'assistant', content: aiMessage, timestamp: Date.now() }]);
            speakText(aiMessage);
        } catch (error) {
            console.error(error);
        } finally {
            setIsTyping(false);
        }
    }, [difficulty, speakText, setIsTyping]);

    useEffect(() => {
        if (hasStarted.current) return;
        hasStarted.current = true;

        const initialMessages: Message[] = [
            { role: 'user', content: position, timestamp: Date.now() }
        ];
        setMessages(initialMessages);
        getAIResponse(initialMessages);

        // Overall Global Timer
        timerRef.current = setInterval(() => {
            setTimeLeft((prev: number) => {
                if (prev <= 1) {
                    if (timerRef.current) clearInterval(timerRef.current);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            window.speechSynthesis.cancel();
        };
    }, [getAIResponse, position]);

    const handleSend = useCallback(async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        const contentToSend = input.trim();
        if (!contentToSend || isTyping || isSpeaking || timeLeft === 0) return;

        const userMessage: Message = { role: 'user', content: contentToSend, timestamp: Date.now() };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput('');

        await getAIResponse(newMessages);
    }, [getAIResponse, input, isTyping, isSpeaking, timeLeft, messages]);

    useEffect(() => {
        if (timeLeft === 0) {
            onFinish(messages);
        }
    }, [timeLeft, messages, onFinish]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);



    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert('Speech recognition is not supported in this browser.');
            return;
        }

        recognitionRef.current = new SpeechRecognition();
        if (recognitionRef.current) {
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onstart = () => setIsListening(true);
            recognitionRef.current.onend = () => setIsListening(false);
            recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
                console.error('Speech recognition error:', event.error);
                setIsListening(false);
            };

            recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
                const transcript = event.results[0][0].transcript;
                setInput(transcript);
            };

            recognitionRef.current.start();
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col h-screen pt-20">
            <div className="flex-none px-6 py-4 glass border-b border-white/10 flex items-center justify-between">
                <div>
                    <h2 className="text-sm font-medium text-secondary uppercase tracking-widest">Topic</h2>
                    <p className="font-bold text-white uppercase">{topic}</p>
                </div>
                <div className="flex gap-8">
                    <div className="text-right">
                        <h2 className="text-sm font-medium text-secondary uppercase tracking-widest">Time Remaining</h2>
                        <p className={`font-bold tabular-nums ${timeLeft < 30 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                            {formatTime(timeLeft)}
                        </p>
                    </div>
                </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-8 space-y-6">
                {messages.map((m, i) => (
                    <div
                        key={i}
                        className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
                    >
                        <div
                            className={`max-w-[80%] p-4 rounded-2xl relative ${m.role === 'user'
                                ? 'bg-white text-black font-medium'
                                : 'glass border border-white/10 text-white leading-relaxed'
                                }`}
                        >
                            <div className="text-[10px] opacity-50 mb-1 uppercase tracking-tighter">
                                {m.role === 'user' ? 'You' : 'AI Assistant'}
                            </div>
                            <p className="whitespace-pre-wrap">{m.content}</p>
                            {m.role === 'assistant' && i === messages.length - 1 && isSpeaking && (
                                <div className="absolute -right-2 -top-2 bg-secondary text-[8px] px-1.5 py-0.5 rounded-full animate-bounce">
                                    Speaking...
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex justify-start animate-fade-in">
                        <div className="glass border border-white/10 p-4 rounded-2xl flex gap-1">
                            <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" />
                            <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce delay-75" />
                            <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce delay-150" />
                        </div>
                    </div>
                )}
            </div>

            <div className="flex-none p-6 glass border-t border-white/10">
                <form onSubmit={handleSend} className="max-w-4xl mx-auto flex gap-4">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={isTyping || isSpeaking || timeLeft === 0}
                            placeholder={isSpeaking ? "Listen to the AI's points..." : isListening ? "Listening..." : "Counter the AI's points..."}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-white/30 transition-colors disabled:opacity-50"
                        />
                        <button
                            type="button"
                            onClick={toggleListening}
                            disabled={isTyping || isSpeaking || timeLeft === 0}
                            className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'text-secondary hover:bg-white/10'
                                }`}
                            title={isListening ? 'Stop Listening' : 'Voice Input'}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                                <path d="M19 10a1 1 0 1 0-2 0 5 5 0 1 1-10 0 1 1 0 0 0-2 0 7 7 0 1 0 14 0Z" />
                                <path d="M12 19a1 1 0 1 0 0 2 1 1 0 1 0 0-2Z" />
                            </svg>
                        </button>
                    </div>
                    <button
                        type="submit"
                        disabled={isTyping || isSpeaking || !input.trim() || timeLeft === 0}
                        className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-all disabled:opacity-50 transform active:scale-95"
                    >
                        {isSpeaking ? 'Listening...' : 'Send'}
                    </button>
                </form>
            </div>
        </div>
    );
}
