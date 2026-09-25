import { serverSupabase } from '../../../lib/server-supabase';

export async function GET() {
  if (!serverSupabase) {
    return Response.json({ error: 'Supabase not configured' }, { status: 500 });
  }

  const { data, error } = await serverSupabase.from('tokens').select('*').order('created_at', { ascending: false });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ tokens: data ?? [] });
}

export async function POST(request) {
  if (!serverSupabase) {
    return Response.json({ error: 'Supabase not configured' }, { status: 500 });
  }

  const payload = await request.json();

  const { data, error } = await serverSupabase
    .from('tokens')
    .insert({
      token_number: payload.token_number,
      vehicle_number: payload.vehicle_number,
      driver_name: payload.driver_name,
      driver_phone: payload.driver_phone,
      vehicle_type: payload.vehicle_type,
      pass_type: payload.pass_type,
      spot: payload.spot,
      status: 'active',
      entry_at: new Date().toISOString(),
      paid_minutes: payload.paid_minutes ?? 60,
      paid_amount: payload.paid_amount ?? 0,
      created_by: payload.created_by ?? null,
    })
    .select();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ token: data?.[0] ?? null });
}
