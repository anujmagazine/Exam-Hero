
import { GoogleGenAI, Modality } from "@google/genai";

export const startChatCoach = async (history: { role: 'user' | 'model', parts: { text: string }[] }[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `You are ZenBoard Coach, an empathetic and supportive mentor for Grade 10 students facing board exams. 
      Your goal is to help them manage exam anxiety, reduce mistakes caused by panic, and build emotional resilience.
      
      CRITICAL FORMATTING RULES:
      1. Use Markdown for structure. Use '###' for section headers and '**' for emphasis.
      2. Use bullet points or numbered lists for steps and strategies to make them easy to read.
      3. Use short paragraphs. Avoid walls of text.
      4. Focus on:
         - Cognitive Reframing: Turning "What if I fail" into "I can handle one question at a time".
         - Practical Advice: Strategies for time management, "stuck" moments, and pre-exam jitters.
         - Emotional Validation: Acknowledge their fear as normal but manageable.
      
      Keep your responses encouraging, structured, and geared towards a 15-year-old student.`,
    },
  });
  return chat;
};

export const getSimulatedResponse = async (scenario: string, userResponse: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `
      Scenario: ${scenario}
      The student's past experience/reaction: "${userResponse}"
      
      Provide empathetic, brief, and constructive feedback on how they handled this. 
      If their reaction was panicked, validate the feeling but suggest one small 'next time' strategy. 
      If it was calm, reinforce why that was a great move. 
      Limit to 3 short sentences. Be supportive and practical.
    `,
    config: {
      temperature: 0.7,
    }
  });
  return response.text;
};

export const generateSpeech = async (text: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Zephyr' },
        },
      },
    },
  });
  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
};

// Audio Utilities
export function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}
