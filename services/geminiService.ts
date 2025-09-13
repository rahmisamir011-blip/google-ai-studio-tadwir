import { GoogleGenAI } from "@google/genai";
import { getVisionPrompt, getLibraryPrompt } from '../constants';
import type { AiResponse } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToGenerativePart = (file: File): Promise<{ inlineData: { data: string; mimeType: string; }; }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.error) {
        return reject(reader.error);
      }
      if (typeof reader.result !== 'string') {
        return reject(new Error("File could not be read as a string."));
      }
      // The result is a data URL: "data:<mime-type>;base64,<data>"
      const parts = reader.result.split(',');
      if (parts.length < 2 || !parts[1]) {
        return reject(new Error("Invalid data URL format."));
      }
      resolve({
        inlineData: { data: parts[1], mimeType: file.type },
      });
    };
    reader.onerror = reject; // FileReader.onerror handles read errors.
    reader.readAsDataURL(file);
  });
};

const parseResponse = (responseText: string): AiResponse => {
    const lines = responseText.split('\n').filter(line => line.trim() !== '');
    
    const response: AiResponse = {
        itemName: "لم يتم تحديد العنصر",
        notToDo: "لم نتمكن من تحليل هذه النقطة.",
        toDo: "لم نتمكن من تحليل هذه النقطة.",
        alternatives: "لم نتمكن من تحليل هذه النقطة.",
        whereToBuy: "لم نتمكن من تحليل هذه النقطة.",
        motivation: "كل خطوة صغيرة تحدث فرقاً كبيراً!",
        category: 'general',
    };

    if (lines.length < 7) { 
      console.error("Response has fewer than 7 lines", lines);
      throw new Error("الرد من الذكاء الاصطناعي غير مكتمل. الرجاء المحاولة مرة أخرى.");
    }
    
    // Line 1: Item Name
    if (lines[0].includes("الاسم:")) {
        response.itemName = lines[0].substring(lines[0].indexOf(":") + 1).trim();
    } else {
        response.itemName = lines[0].trim();
    }
    
    // Line 2: Not To Do
    response.notToDo = lines[1].trim();

    // Line 3: To Do
    response.toDo = lines[2].trim();

    // Line 4: Alternatives
    response.alternatives = lines[3].trim();

    // Line 5: Where To Buy
    response.whereToBuy = lines[4].trim();
    
    // Line 6: Motivation
    response.motivation = lines[5].trim();

    // Line 7: Category
    const categoryLine = lines[6];
    if (categoryLine.includes("الصنف:")) {
         const categoryText = categoryLine.substring(categoryLine.indexOf(":") + 1).trim();
         switch (categoryText) {
            case 'بلاستيك': response.category = 'plastic'; break;
            case 'ورق': response.category = 'paper'; break;
            case 'زجاج': response.category = 'glass'; break;
            case 'معدن': response.category = 'metal'; break;
            default: response.category = 'general';
         }
    }

    // A final check to see if we got at least the main parts
    if (response.toDo.length < 5) {
        throw new Error("لم نتمكن من فهم رد الذكاء الاصطناعي. قد يكون هناك ضغط على الخدمة.");
    }

    return response;
};

/**
 * A centralized error handler for Gemini API calls.
 * It ensures that any caught error is wrapped in a standard Error object
 * with a user-friendly message.
 * @param error The error caught in the catch block.
 * @returns An Error object.
 */
const handleGeminiError = (error: unknown): Error => {
    console.error("Error communicating with Gemini API:", error);
    
    // Check for rate limit errors first
    if (error instanceof Error && error.message.includes('429')) {
         return new Error("يوجد ضغط على الخدمة حالياً. الرجاء الانتظار قليلاً ثم المحاولة مرة أخرى.");
    }

    if (error instanceof Error) {
        const customMessages = ["حظر", "واضحة", "غير مكتمل", "فهم رد", "فارغًا"];
        if (customMessages.some(msg => error.message.includes(msg))) {
            return error;
        }
    }
    
    return new Error("حدث خطأ أثناء الاتصال بمساعد الذكاء الاصطناعي. الرجاء التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.");
};


export const analyzeImage = async (imageFile: File): Promise<AiResponse> => {
    try {
        const imagePart = await fileToGenerativePart(imageFile);
        const textPart = { text: getVisionPrompt() };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [textPart, imagePart] },
            config: { thinkingConfig: { thinkingBudget: 0 } },
        });

        // Check for blocked responses or empty candidates, which indicates an issue.
        if (!response.candidates || response.candidates.length === 0) {
            const blockReason = response.promptFeedback?.blockReason;
            if (blockReason) {
                console.error(`Request was blocked by the API. Reason: ${blockReason}`);
                throw new Error(`تم حظر الطلب لأسباب تتعلق بالسلامة. الرجاء تعديل الصورة.`);
            }
            throw new Error("لم يتمكن الذكاء الاصطناعي من إنشاء رد. قد تكون الصورة غير واضحة.");
        }

        const responseText = response.text;
        if (!responseText) {
            throw new Error("لم يتمكن الذكاء الاصطناعي من تحليل الصورة. الرد المستلم كان فارغًا.");
        }
        return parseResponse(responseText);
    } catch (error) {
        throw handleGeminiError(error);
    }
};

export const getLibraryInfo = async (query: string): Promise<AiResponse> => {
    try {
        const prompt = getLibraryPrompt(query);
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { thinkingConfig: { thinkingBudget: 0 } },
        });
        
        // Check for blocked responses or empty candidates.
        if (!response.candidates || response.candidates.length === 0) {
            const blockReason = response.promptFeedback?.blockReason;
            if (blockReason) {
                console.error(`Request was blocked by the API. Reason: ${blockReason}`);
                throw new Error(`تم حظر الطلب لأسباب تتعلق بالسلامة. الرجاء تعديل استفسارك.`);
            }
            throw new Error("لم يتمكن الذكاء الاصطناعي من إنشاء رد. قد يكون الاستفسار غير واضح.");
        }
        
        const responseText = response.text;
        if (!responseText) {
            throw new Error("لم يقدم الذكاء الاصطناعي أي رد. الرد المستلم كان فارغًا.");
        }
        return parseResponse(responseText);
    } catch (error) {
        throw handleGeminiError(error);
    }
};