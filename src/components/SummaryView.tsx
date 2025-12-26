'use client';

import { useEffect, useState } from 'react';
import { Message, DebateSummary } from '@/types';

interface SummaryViewProps {
    messages: Message[];
    onRestart: () => void;
}

export default function SummaryView({ messages, onRestart }: SummaryViewProps) {
    const [summary, setSummary] = useState<DebateSummary | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const response = await fetch('/api/summary', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ messages }),
                });
                const data = await response.json();
                setSummary(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchSummary();
    }, [messages]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center space-y-4 pt-20">
                <div className="w-12 h-12 border-4 border-white/10 border-t-white rounded-full animate-spin" />
                <p className="text-secondary animate-pulse">Analyzing your logic...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-20 px-4">
            <div className="max-w-4xl mx-auto space-y-12 animate-fade-in">
                <div className="text-center space-y-4">
                    <h1 className="text-5xl font-bold tracking-tight gradient-text">Debate Analysis</h1>
                    <p className="text-secondary">Here&apos;s a breakdown of your performance.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Analysis Card */}
                    <div className="glass p-8 rounded-3xl border-white/10 space-y-6 md:col-span-2">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <span className="text-2xl">📊</span> Overall Analysis
                        </h3>
                        <p className="text-secondary leading-relaxed">{summary?.overallAnalysis}</p>
                    </div>

                    {/* Strong Arguments */}
                    <div className="glass p-8 rounded-3xl border-white/10 space-y-6">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <span className="text-2xl">💪</span> Strongest Points
                        </h3>
                        <ul className="space-y-4">
                            {(summary?.strongestArguments || []).map((arg, i) => (
                                <li key={i} className="flex gap-3 text-secondary text-sm">
                                    <span className="text-white">•</span> {arg}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Logical Fallacies */}
                    <div className="glass p-8 rounded-3xl border-white/10 space-y-6">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <span className="text-2xl">⚠️</span> Logical Fallacies
                        </h3>
                        <ul className="space-y-4">
                            {(summary?.logicalFallacies || []).map((f, i) => (
                                <li key={i} className="flex gap-3 text-red-400 text-sm">
                                    <span className="font-bold">!</span> {f}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Areas for Improvement */}
                    <div className="glass p-8 rounded-3xl border-white/10 space-y-6">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <span className="text-2xl">📈</span> Areas for Improvement
                        </h3>
                        <ul className="space-y-4">
                            {(summary?.improvementAreas || []).map((area, i) => (
                                <li key={i} className="flex gap-3 text-secondary text-sm">
                                    <span className="text-white">→</span> {area}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources */}
                    <div className="glass p-8 rounded-3xl border-white/10 space-y-6">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <span className="text-2xl">📚</span> Further Resources
                        </h3>
                        <ul className="space-y-4">
                            {(summary?.furtherResources || []).map((res, i) => (
                                <li key={i} className="flex gap-3 text-secondary text-sm">
                                    <span className="text-white">🔗</span> {res}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="flex justify-center pt-8">
                    <button
                        onClick={onRestart}
                        className="px-12 py-4 rounded-xl bg-white text-black font-bold hover:bg-zinc-200 transition-all transform hover:scale-105"
                    >
                        Start New Debate
                    </button>
                </div>
            </div>
        </div>
    );
}
