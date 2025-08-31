import { nanoid } from "nanoid";
import QRCode from "qrcode";
import { BASE_URL, RECEIPT_BASE_URL } from "../../config/index.js";
import store from "../store/memoryStore.js";

function parseDuration(durationStr) {
  const regex = /^(\d+)(s|m|h|d)$/; // 10s, 5m, 2h, 1d
  const match = durationStr.match(regex);
  if (!match) return -1;

  const value = parseInt(match[1]);
  const unit = match[2];

  switch (unit) {
    case "s": return value * 1000;
    case "m": return value * 60 * 1000;
    case "h": return value * 60 * 60 * 1000;
    case "d": return value * 24 * 60 * 60 * 1000;
    default: return -1;
  }
}

export async function createLink(receiptId, expiresIn, format = "png") {
  const token = nanoid(8);
  const targetUrl = `${RECEIPT_BASE_URL}/${receiptId}`;

  let expiresAt = null;
  if (expiresIn) {
    const ms = parseDuration(expiresIn);
    if (ms <= 0) throw new Error("Invalid expiresIn format");
    expiresAt = new Date(Date.now() + ms);
  }

  store.set(token, {
    targetUrl,
    expiresAt,
    scans: 0,
    lastScannedAt: null,
  });

  const shortUrl = `${BASE_URL}/r/${token}`;

  let qrCode;
  if (format === "svg") {
    qrCode = await QRCode.toString(shortUrl, { type: "svg" });
  } else {
    qrCode = await QRCode.toDataURL(shortUrl); // base64 PNG
  }

  return { shortUrl, qrCode, expiresAt, token };
}

export function resolveLink(token) {
  const entry = store.get(token);
  if (!entry) return { error: "Invalid or expired link", status: 404 };

  const { targetUrl, expiresAt } = entry;
  if (expiresAt && new Date() > expiresAt) {
    store.delete(token);
    return { error: "Link expired", status: 410 };
  }

  entry.scans += 1;
  entry.lastScannedAt = new Date();

  return { url: targetUrl };
}

export function getStats(token) {
  const entry = store.get(token);
  if (!entry) return null;

  return {
    token,
    targetUrl: entry.targetUrl,
    scanCount: entry.scans,
    lastScannedAt: entry.lastScannedAt,
    expiresAt: entry.expiresAt,
  };
}
