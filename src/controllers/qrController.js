import { createLink, resolveLink, getStats } from "../services/qrService.js";

export async function generateQR(req, res) {
  try {
    const { receiptId, expiresIn, format } = req.body;
    if (!receiptId) {
      return res.status(400).json({ error: "receiptId is required" });
    }

    const result = await createLink(receiptId, expiresIn, format);
    res.json(result);
  } catch (err) {
    console.error("❌ Error generating QR:", err);
    res.status(500).json({ error: err.message });
  }
}

export function redirectLink(req, res) {
  const { token } = req.params;
  const result = resolveLink(token);

  if (result.error) {
    return res.status(result.status).json({ error: result.error });
  }

  res.redirect(result.url);
}

export function linkStats(req, res) {
  const { token } = req.params;
  const stats = getStats(token);

  if (!stats) {
    return res.status(404).json({ error: "Not found" });
  }

  res.json(stats);
}
