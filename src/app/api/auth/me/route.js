import { neon } from '@neondatabase/serverless';
import { verifyToken } from '@/lib/auth';

export async function GET(request) {
  const cookie = request.cookies.get('token')?.value;
  if (!cookie) return Response.json({ error: 'Yetkisiz' }, { status: 401 });

  const decoded = verifyToken(cookie);
  if (!decoded) return Response.json({ error: 'Yetkisiz' }, { status: 401 });

  const sql = neon(process.env.POSTGRES_URL);
  const [user] = await sql`SELECT id, email, name, company, plan, is_admin, trial_ends_at, plan_expires_at, created_at FROM users WHERE id = ${decoded.id}`;
  if (!user) return Response.json({ error: 'Yetkisiz' }, { status: 401 });

  const now = new Date();
  let subscription = 'active';

  if (user.plan === 'trial' || user.plan === 'free') {
    if (user.trial_ends_at && new Date(user.trial_ends_at) < now) {
      subscription = 'expired';
    }
  } else if (user.plan === 'starter' || user.plan === 'pro') {
    if (user.plan_expires_at && new Date(user.plan_expires_at) < now) {
      subscription = 'expired';
    }
  }

  // Kalan gün hesapla
  let daysLeft = null;
  if (user.plan === 'trial' || user.plan === 'free') {
    if (user.trial_ends_at) {
      daysLeft = Math.max(0, Math.ceil((new Date(user.trial_ends_at) - now) / (1000 * 60 * 60 * 24)));
    }
  } else if (user.plan_expires_at) {
    daysLeft = Math.max(0, Math.ceil((new Date(user.plan_expires_at) - now) / (1000 * 60 * 60 * 24)));
  }

  return Response.json({
    user: {
      id: user.id, email: user.email, name: user.name, company: user.company,
      plan: user.plan, is_admin: user.is_admin,
      trial_ends_at: user.trial_ends_at, plan_expires_at: user.plan_expires_at,
      subscription, daysLeft,
    }
  });
}
