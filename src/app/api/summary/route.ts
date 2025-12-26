import { NextResponse } from 'next/server';
import { Message } from '@/types';

async function generateSummary(messages: Message[]) {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
        return {
            strongestArguments: ["Mock: Remote work improves work-life balance", "Mock: Digital collaboration tools are mature"],
            logicalFallacies: ["Mock: Hasty generalization about office productivity"],
            improvementAreas: ["Mock: Provide more statistical data to support claims"],
            furtherResources: ["Mock: HBR study on remote work 2024"],
            overallAnalysis: "The debate was well-structured. The user defended their position well but could benefit from addressing the social isolation aspect of remote work."
        };
    }

    try {
        const systemPrompt = `Analyze the following debate history. Provide a structured summary including:
            1. Strongest arguments from the user.
            2. Logical fallacies detected in the user's reasoning.
            3. Areas where the user can improve their debating skills.
            4. Recommended resources or perspectives to explore.
            5. A concise overall analysis of the debate.
            Return the response as a JSON object with keys: strongestArguments (array), logicalFallacies (array), improvementAreas (array), furtherResources (array), overallAnalysis (string).
            CRITICAL: Only return the raw JSON object, no markdown, no explanation.`;

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
                temperature: 0.1, // Low temperature for consistent JSON
                response_format: { type: "json_object" }
            }),
        });

        const data = await response.json();

        if (data.error) {
            console.error('Groq Summary Error:', data.error);
            throw new Error(data.error.message);
        }

        return JSON.parse(data.choices[0].message.content);
    } catch (error) {
        console.error('Error generating summary:', error);
        return { error: 'Failed to generate summary' };
    }
}

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();
        const summary = await generateSummary(messages);
        return NextResponse.json(summary);
    } catch {
        return NextResponse.json({ error: 'Failed to process summary' }, { status: 500 });
    }
}
