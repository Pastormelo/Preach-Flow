module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  res.status(200).json({
    available: true,
    configured: Boolean(process.env.OPENAI_API_KEY),
    model: process.env.OPENAI_MODEL || "gpt-5.2",
    provider: "openai",
    docx: true,
    googleDocs: Boolean(process.env.GOOGLE_CLIENT_ID),
  });
};
