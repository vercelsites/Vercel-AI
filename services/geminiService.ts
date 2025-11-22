import { GoogleGenAI, Part } from "@google/genai";
import { AspectRatio, GeneratedImage } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-2.5-flash-image';

interface GenerateResult {
  text: string;
  images: GeneratedImage[];
}

/**
 * Generates or edits images using Gemini 2.5 Flash Image model.
 * If referenceImageBase64 is provided, it performs an edit/variation task.
 * Otherwise, it generates an image from scratch.
 */
export const generateContent = async (
  prompt: string,
  options: { aspectRatio: AspectRatio },
  referenceImageBase64?: string,
  referenceImageMimeType?: string
): Promise<GenerateResult> => {
  
  try {
    const parts: Part[] = [];

    // If we have a reference image, add it to the parts (Editing/Variation mode)
    if (referenceImageBase64 && referenceImageMimeType) {
      parts.push({
        inlineData: {
          data: referenceImageBase64,
          mimeType: referenceImageMimeType
        }
      });
    }

    // Add the text prompt
    parts.push({ text: prompt });

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: parts,
      },
      config: {
        imageConfig: {
          aspectRatio: options.aspectRatio,
        },
        // Note: numberOfImages is not strictly supported in generateContent config for this model in all environments,
        // so we handle variations at the application level if needed, or rely on the model to return what it can.
        // We will rely on a single call per variation request in the UI logic for robustness.
      }
    });

    const generatedImages: GeneratedImage[] = [];
    let generatedText = "";

    if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          const mimeType = part.inlineData.mimeType || 'image/png';
          const url = `data:${mimeType};base64,${part.inlineData.data}`;
          generatedImages.push({ url, mimeType });
        } else if (part.text) {
          generatedText += part.text;
        }
      }
    }

    return {
      text: generatedText,
      images: generatedImages
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
