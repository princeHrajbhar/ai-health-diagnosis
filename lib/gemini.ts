import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.warn('GEMINI_API_KEY is not defined in environment variables.');
}

const genAI = new GoogleGenerativeAI(apiKey || '');

export const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
    },
});
