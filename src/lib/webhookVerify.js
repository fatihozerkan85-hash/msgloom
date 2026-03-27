import crypto from 'crypto';

export function verifyMetaWebhook(rawBody, signature) {
  const appSecret = process.env.FACEBOOK_APP_SECRET;
  if (!appSecret || !signature) return false;

  const expectedSig = 'sha256=' + crypto
    .createHmac('sha256', appSecret)
    .update(rawBody)
    .digest('hex');

  // Timing-safe karşılaştırma — timing attack'ı önler
  if (signature.length !== expectedSig.length) return false;
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSig)
  );
}

export function verifyTelegramWebhook(request) {
  const secretToken = request.headers.get('x-telegram-bot-api-secret-token');
  const expected = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!expected || !secretToken) return false;
  if (secretToken.length !== expected.length) return false;
  return crypto.timingSafeEqual(
    Buffer.from(secretToken),
    Buffer.from(expected)
  );
}
