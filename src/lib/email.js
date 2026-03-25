import { Resend } from 'resend';

let resend;
function getResend() {
  if (!resend) resend = new Resend(process.env.RESEND_API_KEY);
  return resend;
}

export function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendVerificationEmail(email, code) {
  try {
    await getResend().emails.send({
      from: process.env.EMAIL_FROM || 'MsgLoom <noreply@msgloom.com.tr>',
      to: email,
      subject: 'MsgLoom - E-posta Doğrulama Kodunuz',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; font-size: 28px; margin: 0;">MsgLoom</h1>
          </div>
          <div style="background: #f8fafc; border-radius: 12px; padding: 30px; text-align: center;">
            <h2 style="color: #1e293b; font-size: 20px; margin: 0 0 10px;">E-posta Doğrulama</h2>
            <p style="color: #64748b; font-size: 14px; margin: 0 0 24px;">Hesabınızı doğrulamak için aşağıdaki kodu kullanın:</p>
            <div style="background: #fff; border: 2px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 0 0 24px;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #2563eb;">${code}</span>
            </div>
            <p style="color: #94a3b8; font-size: 12px; margin: 0;">Bu kod 10 dakika içinde geçerliliğini yitirecektir.</p>
          </div>
          <p style="color: #94a3b8; font-size: 11px; text-align: center; margin-top: 20px;">
            Bu e-postayı siz talep etmediyseniz, lütfen dikkate almayın.
          </p>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error('Email gönderme hatası:', error);
    return { success: false, error: error.message };
  }
}
