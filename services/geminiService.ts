import { GoogleGenAI, Type } from '@google/genai';
import { ArtifactAnalysis } from '../types';

// Initialize the Google GenAI client
// Note: process.env.API_KEY is expected to be provided by the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY, vertexai: true });

export const analyzeArtifact = async (base64Image: string, mimeType: string): Promise<ArtifactAnalysis> => {
  try {
    // Remove the data URL prefix if present (e.g., "data:image/jpeg;base64,")
    const base64Data = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        role: 'user',
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          {
            text: 'You are an expert archaeologist and historian. Analyze this image of an artifact. Provide a detailed, structured analysis including its likely name, the era it belongs to, its geographical origin, primary materials, a detailed visual and historical description, and its cultural or historical significance. Also provide a confidence score (0-100) for your assessment.',
          },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: {
              type: Type.STRING,
              description: 'The common or scholarly name of the artifact.',
            },
            era: {
              type: Type.STRING,
              description: 'The estimated time period, century, or specific era (e.g., "Late Bronze Age", "14th Century BCE").',
            },
            origin: {
              type: Type.STRING,
              description: 'The likely geographical origin or civilization (e.g., "Ancient Egypt", "Mayan Empire").',
            },
            material: {
              type: Type.STRING,
              description: 'The primary materials used to create the artifact (e.g., "Terracotta", "Bronze", "Obsidian").',
            },
            description: {
              type: Type.STRING,
              description: 'A detailed visual description of the artifact and its condition.',
            },
            significance: {
              type: Type.STRING,
              description: 'The historical, cultural, or religious significance of the artifact.',
            },
            confidenceScore: {
              type: Type.NUMBER,
              description: 'A confidence score from 0 to 100 indicating how certain you are of this identification.',
            },
          },
          required: ['name', 'era', 'origin', 'material', 'description', 'significance', 'confidenceScore'],
        },
      },
    });

    const jsonStr = response.text.trim();
    const analysisResult: ArtifactAnalysis = JSON.parse(jsonStr);
    return analysisResult;
  } catch (error) {
    console.error('Error analyzing artifact:', error);
    throw new Error('Failed to analyze the artifact. Please try again.');
  }
};
