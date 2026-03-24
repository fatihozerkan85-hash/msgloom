export async function GET() {
  return Response.json({ hello: 'world', time: new Date().toISOString() });
}
