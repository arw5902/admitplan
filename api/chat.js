module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: { message: "GEMINI_API_KEY not set in Vercel environment variables." } });
  }

  try {
    // Frontend sends Anthropic format: { system, messages, model, max_tokens }
    // We translate to Gemini format so the frontend doesn't need any changes
    const { system, messages } = req.body;

    // Convert Anthropic roles to Gemini roles
    // Anthropic: [{ role: "user"|"assistant", content: "..." }]
    // Gemini:    [{ role: "user"|"model", parts: [{ text: "..." }] }]
    const geminiContents = messages.map(function(m) {
      return {
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }]
      };
    });

    var geminiBody = {
      systemInstruction: {
        parts: [{ text: system || "You are a helpful assistant." }]
      },
      contents: geminiContents,
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7
      }
    };

    var url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + apiKey;

    var response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(geminiBody)
    });

    var data = await response.json();

    if (data.error) {
      return res.status(response.status).json({
        error: { message: data.error.message || "Gemini API error" }
      });
    }

    // Convert Gemini response back to Anthropic format so frontend works unchanged
    // Gemini:    { candidates: [{ content: { parts: [{ text: "..." }] } }] }
    // Anthropic: { content: [{ type: "text", text: "..." }] }
    var text = "";
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
      text = data.candidates[0].content.parts.map(function(p) { return p.text; }).join("");
    } else {
      text = "Sorry, I couldn't generate a response.";
    }

    return res.status(200).json({
      content: [{ type: "text", text: text }]
    });

  } catch (err) {
    return res.status(500).json({ error: { message: "Failed to connect: " + err.message } });
  }
};
