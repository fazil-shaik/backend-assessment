import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Gemini endpoint
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

export async function getAIIntent(lead, offer) {
  const prompt = `
  Given:
  Offer: ${offer.name}
  Value Props: ${offer.value_props.join(", ")}
  Ideal Use Cases: ${offer.ideal_use_cases.join(", ")}

  Lead: ${JSON.stringify(lead)}

  Task: Classify this lead's buying intent as High, Medium, or Low.
  Respond only in JSON format like:
  {"intent":"High|Medium|Low","reason":"1-2 sentence reasoning"}
  `;

  try {
    const res = await axios.post(GEMINI_URL, {
      contents: [{ parts: [{ text: prompt }] }]
    });
    const text = res.data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    const json = JSON.parse(text);
    return json;
  } catch (err) {
    console.error("Gemini API error:", err.message);
    return { intent: "Medium", reason: "Fallback reasoning (Gemini error)" };
  }
}
