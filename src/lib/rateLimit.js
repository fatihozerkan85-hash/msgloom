// In-memory rate limiter (Vercel serverless uyumlu — her instance kendi state'ini tutar)
const attempts = new Map();

export function rateLimit(key, { maxAttempts = 5, windowMs = 15 * 60 * 1000 } = {}) {
  const now = Date.now();
  const record = attempts.get(key);

  // Temizle — süresi dolmuş kayıtları sil
  if (record && now - record.firstAttempt > windowMs) {
    attempts.delete(key);
    return { allowed: true, remaining: maxAttempts - 1 };
  }

  if (!record) {
    attempts.set(key, { count: 1, firstAttempt: now });
    return { allowed: true, remaining: maxAttempts - 1 };
  }

  if (record.count >= maxAttempts) {
    const retryAfter = Math.ceil((record.firstAttempt + windowMs - now) / 1000);
    return { allowed: false, remaining: 0, retryAfter };
  }

  record.count++;
  return { allowed: true, remaining: maxAttempts - record.count };
}

// Başarılı girişte sayacı sıfırla
export function resetRateLimit(key) {
  attempts.delete(key);
}
