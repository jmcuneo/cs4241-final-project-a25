import {GoogleGenAI, Type} from "@google/genai";
import {Router} from "express";
import geminiPrompt from "../../../lib/geminiPrompt.ts";

export const router = Router();

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY,
});

if (!process.env.GOOGLE_API_KEY) {
    throw new Error("Missing GOOGLE_API_KEY environment variable");
}

// Route to handle chat requests
router.post('/gemini', async (req, res) => {
    const prompt = req.body.prompt;
    await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            systemInstruction: geminiPrompt.systemInstruction,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    required: ["name", "country"],
                    additionalProperties: false,
                    properties: {
                        name: { type: Type.STRING },
                        country: {
                            type: Type.STRING,
                            // ISO A3 or NO_COUNTRY
                            pattern: "^(?:[A-Z]{3}|NO_COUNTRY)$",
                        },
                    },
                },
            },
            // Reduce variance
            temperature: 0,
        }
    }).then(response => {
        res.send(response.text);
    }).catch(error => {
        console.error("Error from AI: ", error);
        res.status(500).json({error: 'Error generating content'});
    });
})

export default router;
