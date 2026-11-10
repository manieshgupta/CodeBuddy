//Server.js Code of 10.11.2026

import "dotenv/config";
import express from "express"
import cors from "cors"
import helmet from "helmet"
import rateLimit from "express-rate-limit"
import { GoogleGenAI } from "@google/genai";

const app = express();

app.set("trust proxy", 1);

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

//Security Middleware
app.use(helmet());

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true
}));

// Rate Limiting

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later"
});

app.use(limiter);
app.use(express.json({ limit: "10mb" })); //limit our request size to 10mb at max

app.post("/api/explain-code", async (req, res) => {
    try {
        const { code, language } = req.body;
        if (!code) {
            return res.status(502).json({ error: "Empty response from the model. Code is required" });
        }
        const thinkingLevel = code.length > 1500 ? "medium" : "low";
        const response = await ai.interactions.create({
            model: "gemini-3.8-flash",
            input: `Explain the following ${language || "programming"} code to a beginner.

        Rules:
        - Keep the whole answer under 250 words.
        - Use a short intro (1-2 sentences), then a numbered step-by-step walkthrough.
        - Mention only the key concepts. No horizontal rules, no "what it does / why it's needed" repetition.
        - Always finish your final sentence.
        \`\`\`${language || ""}
        ${code}
        \`\`\``,
            generation_config: {
                temperature: 0.3,
                max_output_tokens: 1500, // headroom: 250 words is roughly 350-400 tokens
                thinking_level: thinkingLevel,
            },
        });
        console.log("usage:", response.usage); //displays how much tokens are used
        if (response.status !== "completed") {
            console.warn("Incomplete response, status:", response.status);
            return res.status(502).json({ error: "Response was incomplete, please try again" });
        }
        const explanation = response?.output_text;
        if (!explanation) {
            return res.status(400).json({ error: "Code is required" });
        }
        console.log(explanation);
        res.json({ explanation, language: language || "unknown" });
    }
    catch (err) {
        console.error("Code Explain API Error:", err);
        res.status(500).json({ error: "Server error", details: err.message });
    }
});

const PORT = process.env.PORT || 3001;

if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

export default app;
