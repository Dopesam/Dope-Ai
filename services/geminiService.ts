import { GoogleGenAI, Modality } from "@google/genai";
import { AspectRatio, ImageSize, VoiceName } from "../types";
import { createAudioBlobFromBase64 } from "../utils/audioUtils";

/**
 * Uses a text model to refine and expand the user's prompt for better image generation results.
 */
export const enhancePrompt = async (originalPrompt: string): Promise<string> => {
  if (!process.env.API_KEY) throw new Error("API Key is missing.");
  if (!originalPrompt.trim()) return "";

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are an expert AI prompt engineer. Rewrite the following user prompt to be highly detailed, descriptive, and optimized for generating a high-quality image. Focus on lighting, composition, texture, mood, and artistic style. Output ONLY the refined prompt text, no explanations. 
      
      User Prompt: "${originalPrompt}"`,
    });

    return response.text?.trim() || originalPrompt;
  } catch (error) {
    console.error("Prompt Enhancement Error:", error);
    return originalPrompt; // Fallback to original if enhancement fails
  }
};

/**
 * Generates 4 variations of an image based on the prompt and optional reference image.
 */
export const generateImageOptions = async (
  prompt: string,
  aspectRatio: AspectRatio,
  size: ImageSize,
  referenceImage?: string | null
): Promise<string[]> => {
  if (!process.env.API_KEY) throw new Error("API Key is missing.");

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-2.5-flash-image';

  // gemini-2.5-flash-image does not support explicit imageSize config. 
  // We enhance the prompt for higher requested qualities to simulate the intent.
  let finalPrompt = prompt;
  if (size === ImageSize.HIGH) {
    finalPrompt += " , highly detailed, 4k resolution, photorealistic, sharp focus, masterpiece, ultra-high definition";
  } else if (size === ImageSize.MID) {
    finalPrompt += " , detailed, 2k resolution, high quality, sharp";
  }

  // Define the generator function for a single image
  const fetchSingleImage = async (): Promise<string | null> => {
    try {
      const parts: any[] = [];
      
      // If reference image exists, add it first (image-to-image or editing context)
      if (referenceImage) {
        const base64Data = referenceImage.split(',')[1];
        const mimeType = referenceImage.substring(referenceImage.indexOf(':') + 1, referenceImage.indexOf(';'));
        parts.push({
          inlineData: {
            data: base64Data,
            mimeType: mimeType
          }
        });
      }

      parts.push({ text: finalPrompt });

      const response = await ai.models.generateContent({
        model: model,
        contents: {
          parts: parts,
        },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio,
          }
        },
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          const base64EncodeString: string = part.inlineData.data;
          return `data:image/png;base64,${base64EncodeString}`;
        }
      }
      return null;
    } catch (e) {
      console.warn("Single image generation failed", e);
      return null;
    }
  };

  // Run 4 requests in parallel to generate variations
  // We use a simple loop to trigger concurrent requests
  const promises = Array(4).fill(null).map(() => fetchSingleImage());
  
  const results = await Promise.all(promises);
  const successfulImages = results.filter((img): img is string => img !== null);

  if (successfulImages.length === 0) {
    throw new Error("Failed to generate images. Please try again.");
  }

  return successfulImages;
};

export const generateSpeech = async (
  text: string,
  voice: VoiceName,
  stylePrompt?: string,
  referenceAudio?: string | null
): Promise<string> => {
  if (!process.env.API_KEY) throw new Error("API Key is missing.");

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // If a style is provided, we weave it into the prompt.
    // We use "Say:" pattern to ensure the model knows it's a TTS task.
    // Example: "Speak like an old man and say: Hello world"
    let prompt = stylePrompt 
      ? `${stylePrompt} and say: ${text}` 
      : `Say: ${text}`;

    const parts: any[] = [];

    // If reference audio is provided, add it to multimodal input and update prompt
    if (referenceAudio) {
      const base64Data = referenceAudio.split(',')[1];
      const mimeType = referenceAudio.substring(referenceAudio.indexOf(':') + 1, referenceAudio.indexOf(';'));
      
      parts.push({
        inlineData: {
          data: base64Data,
          mimeType: mimeType
        }
      });
      prompt = `Listen to the audio sample provided. Mimic the speaker's tone, voice, and pacing as closely as possible. ${prompt}`;
    }

    parts.push({ text: prompt });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: parts }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    
    if (!base64Audio) {
      // Sometimes the error is buried in the response text if the modality failed silently
      const textPart = response.candidates?.[0]?.content?.parts?.[0]?.text;
      if (textPart) {
          console.error("Model returned text instead of audio:", textPart);
          throw new Error(`Model returned text: ${textPart}`);
      }
      throw new Error("No audio data found in response.");
    }

    // Convert raw PCM to a playable WAV Blob URL
    return createAudioBlobFromBase64(base64Audio);

  } catch (error) {
    console.error("Gemini TTS Error:", error);
    throw error;
  }
};