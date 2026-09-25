import { serverSupabase } from '../lib/server-supabase';

export const dynamic = 'force-dynamic';

const fallbackStats = [
  { label: 'Active Tokens', value: '0', detail: 'Currently in use' },
  { label: 'Parked Vehicles', value: '0', detail: 'At parking spot' },
  { label: "Today's Total", value: '0', detail: 'Vehicles passed today' },
  { label: "Today's Revenue", value: '₹0', detail: 'Total earnings' },
];

const fallbackTokens = [];
const fallbackNotifications = [];

function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function formatMinutes(totalMinutes) {
  if (!Number.isFinite(totalMinutes) || totalMinutes <= 0) return '0m';
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours && minutes) return `${hours}h ${minutes}m`;
  if (hours) return `${hours}h`;
  return `${minutes}m`;
}

function normalizeStatus(value) {
  if (!value) return 'active';
  return String(value).toLowerCase();
}

function getStatusClass(value) {
  const normalized = normalizeStatus(value);
  return normalized.replace(/\s+/g, '-');
}

function toTitleCase(value) {
  if (!value) return '—';
  return String(value)
    .split('_')
    .join(' ')
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export default async function HomePage() {
  let tokens = [];
  let notifications = [];

  if (serverSupabase) {
    const [tokenResult, notificationResult] = await Promise.all([
      serverSupabase.from('tokens').select('*').order('created_at', { ascending: false }),
      serverSupabase.from('notifications').select('*').order('created_at', { ascending: false }),
    ]);

    if (!tokenResult.error) tokens = tokenResult.data ?? [];
    if (!notificationResult.error) notifications = notificationResult.data ?? [];
  }

  const activeTokens = tokens.filter((token) => normalizeStatus(token.status) === 'active');
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const todayRevenue = tokens
    .filter((token) => {
      if (!token.created_at) return false;
      const createdAt = new Date(token.created_at);
      return createdAt >= todayStart;
    })
    .reduce((sum, token) => sum + Number(token.paid_amount || 0), 0);

  const stats = [
    {
      label: 'Active Tokens',
      value: String(activeTokens.length || 0),
      detail: 'Currently in use',
    },
    {
      label: 'Parked Vehicles',
      value: String(activeTokens.length || 0),
      detail: 'At parking spot',
    },
    {
      label: "Today's Total",
      value: String(tokens.filter((token) => {
        if (!token.created_at) return false;
        const createdAt = new Date(token.created_at);
        return createdAt >= todayStart;
      }).length || 0),
      detail: 'Vehicles passed today',
    },
    {
      label: "Today's Revenue",
      value: formatCurrency(todayRevenue),
      detail: 'Total earnings',
    },
  ];

  const rows = tokens.length ? tokens.slice(0, 10) : fallbackTokens;
  const alertItems = notifications.length ? notifications.slice(0, 5) : fallbackNotifications;

  return (
    <main className="page-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Railway operations</p>
          <h1>Railway Token System</h1>
        </div>
        <div className="role-pill">SITE OWNER</div>
      </header>

      <section className="stats-grid">
        {stats.map((stat) => (
          <article key={stat.label} className="stat-card">
            <div className="stat-label">{stat.label}</div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-detail">{stat.detail}</div>
          </article>
        ))}
      </section>

      <section className="panel-grid">
        <article className="panel">
          <div className="panel-header">
            <h2>Active tokens</h2>
            <button className="primary-btn">+ Create Token</button>
          </div>
          <table>
            <thead>
              <tr>
                <th>Token</th>
                <th>Vehicle</th>
                <th>Type</th>
                <th>Status</th>
                <th>Duration</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {rows.length > 0 ? (
                rows.map((entry) => {
                  const elapsedMinutes = entry.entry_at
                    ? Math.max(0, Math.round((Date.now() - new Date(entry.entry_at).getTime()) / 60000))
                    : 0;
                  const chargeMinutes = Number(entry.paid_minutes || 0);
                  const durationDisplay = formatMinutes(Math.max(elapsedMinutes, chargeMinutes));

                  return (
                    <tr key={entry.id ?? entry.token_number}>
                      <td>{entry.token_number || '—'}</td>
                      <td>{entry.vehicle_number || '—'}</td>
                      <td>{toTitleCase(entry.vehicle_type)}</td>
                      <td>
                        <span className={`badge ${getStatusClass(entry.status)}`}>
                          {toTitleCase(entry.status || 'active')}
                        </span>
                      </td>
                      <td>{durationDisplay}</td>
                      <td>{formatCurrency(entry.paid_amount)}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', color: '#9aa6b2', padding: '1rem' }}>
                    No tokens found yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </article>

        <article className="panel">
          <div className="panel-header">
            <h2>Overdue alerts</h2>
          </div>
          <div className="alert-list">
            {alertItems.length > 0 ? (
              alertItems.map((item) => (
                <div key={item.id ?? `${item.vehicle_number}-${item.recipient_role}`} className={`alert-item ${item.status === 'resolved' ? 'resolved' : item.recipient_role === 'owner' ? 'medium' : 'low'}`}>
                  <div className="alert-head">
                    <strong>{item.vehicle_number || 'Vehicle'}</strong>
                    <span className="mini-badge">{item.recipient_role ? toTitleCase(item.recipient_role) : 'Alert'}</span>
                  </div>
                  <p>{item.message || `Exceeded allowance by ${item.overdue_minutes ?? 0} min`}</p>
                </div>
              ))
            ) : (
              <div className="alert-item low">
                <div className="alert-head">
                  <strong>No alerts</strong>
                  <span className="mini-badge">System</span>
                </div>
                <p>There are currently no overdue vehicles to review.</p>
              </div>
            )}
          </div>
        </article>
      </section>
    </main>
  );
}
