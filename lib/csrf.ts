import crypto from "crypto";

const SECRET =
  process.env.CSRF_SECRET ||
  crypto.randomBytes(32).toString("hex");

const TTL_MS = 24 * 60 * 60 * 1000; // 24 ore

export function generateToken(): string {
  const timestamp = Date.now().toString();
  const nonce = crypto.randomBytes(16).toString("hex");
  const hmac = crypto
    .createHmac("sha256", SECRET)
    .update(timestamp + "." + nonce)
    .digest("hex");
  return `${timestamp}.${nonce}.${hmac}`;
}

export function validateToken(token: string): boolean {
  if (!token || typeof token !== "string") return false;

  const parts = token.split(".");
  if (parts.length !== 3) return false;

  const [timestamp, nonce, hmac] = parts;

  const ts = parseInt(timestamp, 10);
  if (isNaN(ts) || Date.now() - ts > TTL_MS) return false;

  const expected = crypto
    .createHmac("sha256", SECRET)
    .update(timestamp + "." + nonce)
    .digest("hex");

  try {
    const hmacBuf = Buffer.from(hmac, "hex");
    const expectedBuf = Buffer.from(expected, "hex");
    if (hmacBuf.length !== expectedBuf.length) return false;
    return crypto.timingSafeEqual(hmacBuf, expectedBuf);
  } catch {
    return false;
  }
}
