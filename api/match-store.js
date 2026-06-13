const fetch = require("node-fetch");

const STORES = [
  { id: 1, name: "Bailey Road", nearbyAreas: "Rajendra Nagar, Kumhrar, Rukanpura, Kadam Kuan, Lohia Nagar" },
  { id: 2, name: "Danapur", nearbyAreas: "Khagaul, Naubatpur, Bihta, Saguna, Phulwari Sharif" },
  { id: 3, name: "Boring Road", nearbyAreas: "Kidwaipuri, Sri Krishna Puri, Patliputra Colony, New Patliputra Colony" },
  { id: 4, name: "Anishabad", nearbyAreas: "Beur, Gardanibagh, Jakkanpur, Kankarbagh, Hanuman Nagar, Kurji" },
  { id: 5, name: "Maurya Lok", nearbyAreas: "Fraser Road, Exhibition Road, Dak Bungalow, Gandhi Maidan, Biscomaun" },
  { id: 6, name: "Muzaffarpur", nearbyAreas: "Kanti, Motipur, Sitamarhi, Saraiya, Bochaha" },
  { id: 7, name: "Hajipur", nearbyAreas: "Vaishali, Mahua, Lalganj, Jandaha, Patepur" },
  { id: 8, name: "Siwan", nearbyAreas: "Chapra, Gopalganj, Mairwa, Daraunda, Raghunathpur" },
  { id: 9, name: "Darbhanga", nearbyAreas: "Laheriasarai, Samastipur, Madhubani, Benipur, Baheri" },
  { id: 10, name: "Begusarai", nearbyAreas: "Barauni, Teghra, Bakhri, Mansurchak, Khagaria" },
  { id: 11, name: "Rourkela", nearbyAreas: "Sundargarh, Rajgangpur, Bondamunda, Bisra, Panposh" },
  { id: 12, name: "Moradabad", nearbyAreas: "Rampur, Sambhal, Thakurdwara, Kanth, Bilari" },
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
      "https://router.huggingface.co/v1/chat/completions",
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
              content: `You are a FrameKarts store matching assistant. Return ONLY valid JSON. Do not include markdown or explanations.\n\nOutput schema:\n{"store": {"id": number, "name": string}}\n\nYou must select ONLY one store from the provided store list. Never invent store names. Each store has a "nearbyAreas" field listing localities it serves. Match the user's location to the store whose nearbyAreas include or are closest to that location. If no suitable match exists, return {"store": null}.`,
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
