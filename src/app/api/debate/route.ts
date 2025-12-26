import { NextResponse } from 'next/server';
import { Message } from '@/types';

async function getAIResponse(messages: Message[], difficulty: string) {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
        return "This is a simulated counter-argument. Please provide a GROQ_API_KEY in your .env.local file to enable real AI debate. \n\n1. Point one: Logical challenge.\n2. Point two: Evidence-based rebuttal.\n3. Point three: Philosophical inquiry.";
    }

    try {
        const systemPrompt = `You are a skilled debater. Your goal is to challenge the user's position with logical reasoning.
            Difficulty: ${difficulty}. 
            CRITICAL: Your response must be extremely concise (MAX 30 words). 
            Provide 1 sharp point and stop. Be punchy and direct.`;

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    { role: 'system', content: systemPrompt },
                    ...messages.map(m => ({
                        role: m.role === 'model' ? 'assistant' : m.role,
                        content: m.content
                    }))
                ],
                temperature: 0.7,
                max_tokens: 1024,
            }),
        });

        const data = await response.json();

        if (data.error) {
            console.error('Groq API Error:', data.error);
            return `AI Error: ${data.error.message || 'Unknown Groq error'}`;
        }

        return data.choices[0].message.content;
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Could not connect to AI service.";
        console.error('Error calling Groq:', error);
        return `Connection Error: ${errorMessage}`;
    }
}

export async function POST(req: Request) {
    try {
        const { messages, difficulty } = await req.json();
        const aiContent = await getAIResponse(messages, difficulty);

        return NextResponse.json({ content: aiContent });
    } catch {
        return NextResponse.json({ error: 'Failed to process debate' }, { status: 500 });
    }
}
