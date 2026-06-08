module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  res.status(200).json({
    available: true,
    configured: false,
    requiresUserOpenAIKey: true,
    model: process.env.OPENAI_MODEL || "gpt-5.2",
    provider: "openai",
    docx: true,
    googleDocs: Boolean(process.env.GOOGLE_CLIENT_ID),
    auth: Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY),
    database: Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY),
  });
};
