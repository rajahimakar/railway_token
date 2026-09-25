export async function GET() {
  return Response.json({
    status: 'ok',
    app: 'railway-token-live',
    database: 'Supabase-ready',
    timestamp: new Date().toISOString(),
  });
}
