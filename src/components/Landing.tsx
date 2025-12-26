'use client';

import { useState } from 'react';
import { Difficulty } from '@/types';

interface LandingProps {
    onStart: (topic: string, position: string, difficulty: Difficulty, timeLimit: number) => void;
}

const TOPICS = [
    { id: 'politics', label: 'Politics', icon: '🏛️' },
    { id: 'science', label: 'Science', icon: '🔬' },
    { id: 'ethics', label: 'Ethics', icon: '⚖️' },
    { id: 'business', label: 'Business', icon: '💼' },
];

const TIMER_OPTIONS = [3, 5, 7, 10];

export default function Landing({ onStart }: LandingProps) {
    const [selectedTopic, setSelectedTopic] = useState('');
    const [customTopic, setCustomTopic] = useState('');
    const [position, setPosition] = useState('');
    const [difficulty, setDifficulty] = useState<Difficulty>('Intermediate');
    const [timeLimit, setTimeLimit] = useState(5);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const topic = selectedTopic === 'custom' || !selectedTopic ? customTopic : selectedTopic;
        if (!topic || !position) return;
        onStart(topic, position, difficulty, timeLimit);
    };

    return (
        <div className="min-h-screen pt-32 pb-20 px-4">
            <div className="max-w-3xl mx-auto space-y-12 animate-fade-in">
                <div className="text-center space-y-4">
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight gradient-text">
                        Test Your Reasoning.
                    </h1>
                    <p className="text-xl text-secondary max-w-xl mx-auto">
                        Challenge your beliefs against an advanced AI debater. Refine your logic and sharpen your arguments.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8 glass p-8 rounded-3xl border-white/10 shadow-2xl">
                    {/* Topic Selection */}
                    <div className="space-y-4">
                        <label className="text-sm font-medium text-secondary uppercase tracking-widest">Select a Topic</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {TOPICS.map((t) => (
                                <button
                                    key={t.id}
                                    type="button"
                                    onClick={() => setSelectedTopic(t.id)}
                                    className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-2 ${selectedTopic === t.id
                                        ? 'border-white bg-white/10 scale-105'
                                        : 'border-white/5 bg-white/5 hover:border-white/20'
                                        }`}
                                >
                                    <span className="text-2xl">{t.icon}</span>
                                    <span className="text-sm font-medium">{t.label}</span>
                                </button>
                            ))}
                        </div>
                        {(selectedTopic === '' || selectedTopic === 'custom') && (
                            <input
                                type="text"
                                placeholder="Or enter a custom topic..."
                                value={customTopic}
                                onChange={(e) => setCustomTopic(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-white/30 transition-colors"
                            />
                        )}
                    </div>

                    {/* Position */}
                    <div className="space-y-4">
                        <label className="text-sm font-medium text-secondary uppercase tracking-widest">What do you believe?</label>
                        <textarea
                            required
                            placeholder="e.g., Remote work is more productive than office work..."
                            value={position}
                            onChange={(e) => setPosition(e.target.value)}
                            className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-white/30 transition-colors resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Difficulty */}
                        <div className="space-y-4">
                            <label className="text-sm font-medium text-secondary uppercase tracking-widest">Difficulty</label>
                            <div className="flex gap-2">
                                {(['Beginner', 'Intermediate', 'Advanced'] as Difficulty[]).map((d) => (
                                    <button
                                        key={d}
                                        type="button"
                                        onClick={() => setDifficulty(d)}
                                        className={`flex-1 py-2 rounded-lg text-sm transition-all ${difficulty === d
                                            ? 'bg-white text-black font-bold'
                                            : 'bg-white/5 text-secondary hover:bg-white/10'
                                            }`}
                                    >
                                        {d}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Duration */}
                        <div className="space-y-4">
                            <label className="text-sm font-medium text-secondary uppercase tracking-widest">Time Limit (Min)</label>
                            <div className="flex gap-2">
                                {TIMER_OPTIONS.map((t) => (
                                    <button
                                        key={t}
                                        type="button"
                                        onClick={() => setTimeLimit(t)}
                                        className={`flex-1 py-2 rounded-lg text-sm transition-all ${timeLimit === t
                                            ? 'bg-white text-black font-bold'
                                            : 'bg-white/5 text-secondary hover:bg-white/10'
                                            }`}
                                    >
                                        {t}m
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 rounded-xl bg-white text-black font-bold text-lg hover:bg-zinc-200 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        Start Debate
                    </button>
                </form>
            </div>
        </div>
    );
}
