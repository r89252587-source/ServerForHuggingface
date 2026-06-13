const fetch = require("node-fetch");

const STORES = [
  { id: 1, name: "Bailey Road" },
  { id: 2, name: "Danapur" },
  { id: 3, name: "Boring Road" },
  { id: 4, name: "Anishabad" },
  { id: 5, name: "Maurya Lok" },
  { id: 6, name: "Muzaffarpur" },
  { id: 7, name: "Hajipur" },
  { id: 8, name: "Siwan" },
  { id: 9, name: "Darbhanga" },
  { id: 10, name: "Begusarai" },
  { id: 11, name: "Rourkela" },
  { id: 12, name: "Moradabad" },
];

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { userLocation } = req.body;

  if (!userLocation) {
    return res.status(400).json({ error: "userLocation is required" });
  }

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "meta-llama/Llama-3.3-70B-Instruct",
          messages: [
            {
              role: "system",
              content: `You are a FrameKarts store matching assistant. Return ONLY valid JSON. Do not include markdown or explanations.\n\nOutput schema:\n{\"store\": {\"id\": number, \"name\": string}}\n\nYou must select ONLY one store from the provided store list. Never invent store names. Match the user's location to the nearest or most relevant store. If no suitable match exists, return {\"store\": null}.`,
            },
            {
              role: "user",
              content: `User location: ${userLocation}\n\nFrameKarts stores:\n${JSON.stringify(STORES, null, 2)}\n\nReturn only one matching store in JSON format.`,
            },
          ],
          temperature: 0.01,
          max_tokens: 200,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({ error: data });
    }

    const rawText = data.choices[0].message.content.trim();
    const cleaned = rawText.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return res.json(parsed);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
