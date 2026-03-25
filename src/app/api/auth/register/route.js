import { neon } from '@neondatabase/serverless';
import { hashPassword } from '@/lib/auth';
import { generateCode, sendVerificationEmail } from '@/lib/email';

export async function POST(request) {
  try {
    const { email, password, name, company } = await request.json();

    if (!email || !password) {
      return Response.json({ error: 'Email ve şifre gerekli' }, { status: 400 });
    }

    if (password.length < 6) {
      return Response.json({ error: 'Şifre en az 6 karakter olmalı' }, { status: 400 });
    }

    const sql = neon(process.env.POSTGRES_URL);

    // Add columns if they don't exist
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_code VARCHAR(6)`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_expires TIMESTAMP`;

    const [existing] = await sql`SELECT id, email_verified FROM users WHERE email = ${email}`;

    if (existing && existing.email_verified) {
      return Response.json({ error: 'Bu email zaten kayıtlı' }, { status: 400 });
    }

    const code = generateCode();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 min
    const password_hash = await hashPassword(password);

    if (existing && !existing.email_verified) {
      // Update existing unverified user
      await sql`
        UPDATE users SET password_hash = ${password_hash}, name = ${name || null}, company = ${company || null},
        verification_code = ${code}, verification_expires = ${expires}
        WHERE id = ${existing.id}
      `;
    } else {
      // Create new user — 5 gün trial
      const trialEnds = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMP`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS plan_expires_at TIMESTAMP`;
      await sql`
        INSERT INTO users (email, password_hash, name, company, verification_code, verification_expires, email_verified, plan, trial_ends_at)
        VALUES (${email}, ${password_hash}, ${name || null}, ${company || null}, ${code}, ${expires}, false, 'trial', ${trialEnds})
      `;
    }

    const emailResult = await sendVerificationEmail(email, code);
    if (!emailResult.success) {
      return Response.json({ error: 'Doğrulama e-postası gönderilemedi. Lütfen tekrar deneyin.' }, { status: 500 });
    }

    return Response.json({ success: true, needsVerification: true, email });
  } catch (error) {
    console.error('Kayıt hatası:', error);
    return Response.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
