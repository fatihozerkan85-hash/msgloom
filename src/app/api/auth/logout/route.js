export async function POST() {
  return Response.json({ success: true }, {
    headers: { 'Set-Cookie': 'token=; Path=/; HttpOnly; Max-Age=0' }
  });
}
