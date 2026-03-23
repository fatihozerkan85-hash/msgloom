import { getUser } from '@/lib/auth';

export async function GET(request) {
  const user = await getUser(request);
  if (!user) return Response.json({ error: 'Yetkisiz' }, { status: 401 });
  return Response.json({ user });
}
