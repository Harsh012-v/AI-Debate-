'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Landing from '@/components/Landing';
import DebateInterface from '@/components/DebateInterface';
import SummaryView from '@/components/SummaryView';
import { Difficulty, Message } from '@/types';

type AppState = 'landing' | 'debating' | 'summary';

export default function Home() {
  const [state, setState] = useState<AppState>('landing');
  const [debateParams, setDebateParams] = useState<{
    topic: string;
    position: string;
    difficulty: Difficulty;
    timeLimit: number;
  } | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const handleStartDebate = (topic: string, position: string, difficulty: Difficulty, timeLimit: number) => {
    setDebateParams({ topic, position, difficulty, timeLimit });
    setState('debating');
  };

  const handleFinishDebate = (finalMessages: Message[]) => {
    setMessages(finalMessages);
    setState('summary');
  };

  const handleRestart = () => {
    setState('landing');
    setDebateParams(null);
    setMessages([]);
  };

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-white selection:text-black">
      <Navbar />

      {state === 'landing' && (
        <Landing onStart={handleStartDebate} />
      )}

      {state === 'debating' && debateParams && (
        <DebateInterface
          topic={debateParams.topic}
          position={debateParams.position}
          difficulty={debateParams.difficulty}
          timeLimit={debateParams.timeLimit}
          onFinish={handleFinishDebate}
        />
      )}

      {state === 'summary' && (
        <SummaryView
          messages={messages}
          onRestart={handleRestart}
        />
      )}
    </main>
  );
}
