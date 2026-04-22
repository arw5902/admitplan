module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  var apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: { message: "GEMINI_API_KEY not set in Vercel environment variables." } });
  }

  try {
    var body = req.body;
    var system = body.system || "You are a helpful assistant.";
    var messages = body.messages || [];

    // Convert Anthropic message format to Gemini format
    var geminiContents = messages.map(function(m) {
      return {
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }]
      };
    });

    var geminiBody = {
      systemInstruction: { parts: [{ text: system }] },
      contents: geminiContents,
      generationConfig: {
        maxOutputTokens: 800,
        temperature: 0.7
      }
    };

    var url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=" + apiKey;

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
