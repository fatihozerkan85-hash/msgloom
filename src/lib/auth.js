import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'msgloom-secret-key-change-this';

export async function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export function createToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, plan: user.plan, is_admin: user.is_admin },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export async function getUser(request) {
  const cookie = request.cookies.get('token')?.value;
  if (!cookie) return null;

  const decoded = verifyToken(cookie);
  if (!decoded) return null;

  const sql = neon(process.env.POSTGRES_URL);
  const [user] = await sql`SELECT id, email, name, company, plan, is_admin FROM users WHERE id = ${decoded.id}`;
  return user || null;
}
