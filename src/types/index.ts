export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Message {
    role: 'user' | 'assistant' | 'system' | 'model';
    content: string;
    timestamp: number;
}

export interface DebateSession {
    id: string;
    topic: string;
    position: string;
    difficulty: Difficulty;
    timeLimit: number; // in minutes
    messages: Message[];
    status: 'ongoing' | 'completed';
    summary?: DebateSummary;
}

export interface DebateSummary {
    strongestArguments: string[];
    logicalFallacies: string[];
    improvementAreas: string[];
    furtherResources: string[];
    overallAnalysis: string;
}
