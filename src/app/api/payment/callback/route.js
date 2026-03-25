import { neon } from '@neondatabase/serverless';
import Iyzipay from 'iyzipay';
import { NextResponse } from 'next/server';

let _iyzipay;
function getIyzipay() {
  if (!_iyzipay) {
    _iyzipay = new Iyzipay({
      apiKey: process.env.IYZICO_API_KEY,
      secretKey: process.env.IYZICO_SECRET_KEY,
      uri: process.env.IYZICO_BASE_URL || 'https://sandbox-api.iyzipay.com'
    });
  }
  return _iyzipay;
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const token = formData.get('token');

    if (!token) {
      return NextResponse.redirect(new URL('/payment-result?status=error', request.url));
    }

    return new Promise((resolve) => {
      getIyzipay().checkoutForm.retrieve({ locale: Iyzipay.LOCALE.TR, token }, async (err, result) => {
        try {
          if (err || result.status !== 'success' || result.paymentStatus !== 'SUCCESS') {
            console.error('Payment failed:', err || result);
            resolve(NextResponse.redirect(new URL('/payment-result?status=failed', request.url)));
            return;
          }

          const parts = result.conversationId?.split('-') || [];
          const userId = parts[0];
          const planId = parts[1];

          if (!userId || !planId) {
            resolve(NextResponse.redirect(new URL('/payment-result?status=error', request.url)));
            return;
          }

          const sql = neon(process.env.POSTGRES_URL);

          // Kullanıcının planını güncelle — 30 gün süre
          const planExpires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
          await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS plan_expires_at TIMESTAMP`;
          await sql`UPDATE users SET plan = ${planId}, plan_expires_at = ${planExpires} WHERE id = ${parseInt(userId)}`;

          await sql`CREATE TABLE IF NOT EXISTS payments (
            id SERIAL PRIMARY KEY, user_id INTEGER NOT NULL, plan VARCHAR(50),
            amount DECIMAL(12,2), currency VARCHAR(5) DEFAULT 'TRY',
            iyzico_payment_id VARCHAR(100), status VARCHAR(20) DEFAULT 'success',
            created_at TIMESTAMP DEFAULT NOW()
          )`;

          await sql`INSERT INTO payments (user_id, plan, amount, iyzico_payment_id, status)
            VALUES (${parseInt(userId)}, ${planId}, ${result.paidPrice}, ${result.paymentId}, 'success')`;

          resolve(NextResponse.redirect(new URL(`/payment-result?status=success&plan=${planId}&amount=${result.paidPrice}`, request.url)));
        } catch (dbErr) {
          console.error('DB error after payment:', dbErr);
          resolve(NextResponse.redirect(new URL('/payment-result?status=error', request.url)));
        }
      });
    });
  } catch (error) {
    console.error('Payment callback error:', error);
    return NextResponse.redirect(new URL('/payment-result?status=error', request.url));
  }
}
