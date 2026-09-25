import { serverSupabase } from '../../../lib/server-supabase';

const defaultSiteLayouts = [
  { name: 'Site-A1', capacity: 20 },
  { name: 'Site-A2', capacity: 18 },
  { name: 'Site-B1', capacity: 16 },
  { name: 'Site-B2', capacity: 14 },
];

function normalizeToken(row) {
  if (!row) return null;

  const siteName = row.site_name || row.site || 'Site-A1';
  const slotNumber = Number(row.slot_number ?? row.slot ?? 1);
  const tokenNumber = row.token_number || row.id || row.token || 'N/A';
  const rawStatus = String(row.status || 'active').toLowerCase();
  const status = rawStatus === 'completed'
    ? 'Completed'
    : rawStatus === 'cancelled'
      ? 'Cancelled'
      : rawStatus === 'active'
        ? 'Active'
        : 'Active';

  return {
    id: tokenNumber,
    token: tokenNumber,
    vehicle: row.vehicle_number || row.vehicle || 'N/A',
    type: row.vehicle_type === 'car' ? 'Car' : 'Bike',
    status,
    site: siteName,
    slot: slotNumber,
    duration: row.paid_minutes ? `${Math.floor(row.paid_minutes / 60)}h ${String(row.paid_minutes % 60).padStart(2, '0')}m` : '1h 00m',
    paidDuration: row.paid_minutes ? `${Math.floor(row.paid_minutes / 60)}h ${String(row.paid_minutes % 60).padStart(2, '0')}m` : '1h 00m',
    amount: Number(row.paid_amount ?? 0),
    paid_minutes: Number(row.paid_minutes ?? 0),
  };
}

async function resolveAvailableSlot(recordedSiteName, siteCatalog, activeTokens) {
  const candidateSites = siteCatalog.length ? siteCatalog : defaultSiteLayouts;
  const preferredSite = candidateSites.find((site) => site.name === recordedSiteName) || candidateSites[0];
  const occupiedSlots = new Set(
    activeTokens
      .filter((token) => token.site_name === preferredSite.name && Number(token.slot_number))
      .map((token) => Number(token.slot_number))
  );

  for (let slot = 1; slot <= preferredSite.capacity; slot += 1) {
    if (!occupiedSlots.has(slot)) {
      return { site_name: preferredSite.name, slot_number: slot };
    }
  }

  for (const site of candidateSites) {
    if (site.name === preferredSite.name) continue;
    const siteOccupiedSlots = new Set(
      activeTokens
        .filter((token) => token.site_name === site.name && Number(token.slot_number))
        .map((token) => Number(token.slot_number))
    );

    for (let slot = 1; slot <= site.capacity; slot += 1) {
      if (!siteOccupiedSlots.has(slot)) {
        return { site_name: site.name, slot_number: slot };
      }
    }
  }

  return { site_name: preferredSite.name, slot_number: 1 };
}

export async function GET() {
  if (!serverSupabase) {
    return Response.json({ tokens: [] });
  }

  const { data, error } = await serverSupabase
    .from('tokens')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ tokens: (data ?? []).map(normalizeToken) });
}

export async function POST(request) {
  if (!serverSupabase) {
    return Response.json({ error: 'Supabase not configured' }, { status: 500 });
  }

  const payload = await request.json();

  const { data: siteRows, error: siteError } = await serverSupabase
    .from('parking_sites')
    .select('*')
    .order('name');

  if (siteError) {
    return Response.json({ error: siteError.message }, { status: 500 });
  }

  const siteCatalog = (siteRows?.length ? siteRows : defaultSiteLayouts).map((site) => ({
    name: site.name || site.site,
    capacity: Number(site.capacity || 20),
  }));

  const siteName = payload.site_name || payload.site || 'Site-A1';
  const { data: tokenRows, error: tokenError } = await serverSupabase
    .from('tokens')
    .select('site_name, slot_number')
    .neq('status', 'completed');

  if (tokenError) {
    return Response.json({ error: tokenError.message }, { status: 500 });
  }

  const result = await resolveAvailableSlot(siteName, siteCatalog, tokenRows ?? []);
  const slotNumber = Number(payload.slot_number ?? result.slot_number);
  const tokenNumber = payload.token_number || payload.id || payload.token || `A-${Math.floor(Date.now() / 1000)}`;
  const vehicleType = (payload.vehicle_type || 'car').toLowerCase();
  const passType = payload.pass_type || (payload.status === 'Monthly Pass' ? 'monthly' : 'hourly');
  const spot = payload.spot || `${result.site_name}-${slotNumber}`;

  const { data, error } = await serverSupabase
    .from('tokens')
    .insert({
      token_number: tokenNumber,
      vehicle_number: payload.vehicle_number || payload.vehicle || 'N/A',
      driver_name: payload.driver_name || 'Station user',
      driver_phone: payload.driver_phone || null,
      vehicle_type: vehicleType,
      pass_type: passType,
      site_name: result.site_name,
      slot_number: slotNumber,
      spot,
      status: (payload.status === 'Monthly Pass' ? 'active' : 'active'),
      entry_at: new Date().toISOString(),
      paid_minutes: Number(payload.paid_minutes ?? 60),
      paid_amount: Number(payload.paid_amount ?? 0),
      created_by: payload.created_by ?? null,
    })
    .select();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ token: normalizeToken(data?.[0] ?? null) });
}
