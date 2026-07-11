const { engineConfig } = require("./_engine.js");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const engine = engineConfig();
  res.status(200).json({
    available: true,
    configured: Boolean(engine.apiKey),
    engineConfigured: Boolean(engine.apiKey),
    requiresUserOpenAIKey: !engine.apiKey,
    model: engine.model,
    provider: engine.provider,
    docx: true,
    googleDocs: Boolean(process.env.GOOGLE_CLIENT_ID),
    auth: Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY),
    database: Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY),
  });
};
