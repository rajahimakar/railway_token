"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { clearDemoUser, readDemoUser } from '../../lib/auth';

const starterTokens = [
  { id: 'A-102', vehicle: 'MH-12-BT-3498', type: 'Bike', status: 'Active', duration: '1h 20m', amount: 40 },
  { id: 'A-103', vehicle: 'MH-02-CD-5678', type: 'Bike', status: 'Monthly Pass', duration: '12d remaining', amount: 2000 },
  { id: 'A-101', vehicle: 'MH-15-EF-2341', type: 'Car', status: 'Overdue', duration: '1h 45m', amount: 120 },
];

const starterAlerts = [
  { vehicle: 'MH-15-EF-2341', overdue: '25 min', audience: 'Owner alert', severity: 'medium' },
  { vehicle: 'MH-12-BT-3498', overdue: '9 min', audience: 'Employee queue', severity: 'low' },
];

function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState({ role: 'SITE OWNER', name: 'Owner Admin' });
  const [tokens, setTokens] = useState(starterTokens);
  const [alerts, setAlerts] = useState(starterAlerts);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    token: 'A-104',
    vehicle: 'MH-09-XY-8899',
    type: 'Car',
    status: 'Active',
    duration: '1h 00m',
    amount: '₹80',
  });

  useEffect(() => {
    const saved = readDemoUser();
    if (!saved) {
      router.push('/login');
      return;
    }

    setUser(saved);
  }, [router]);

  const stats = useMemo(() => [
    { label: 'Active Tokens', value: String(tokens.filter((token) => token.status === 'Active').length), detail: 'Currently in use' },
    { label: 'Parked Vehicles', value: String(tokens.filter((token) => token.status === 'Active').length), detail: 'At parking spot' },
    { label: "Today's Total", value: String(tokens.length), detail: 'Vehicles passed today' },
    { label: "Today's Revenue", value: formatCurrency(tokens.reduce((sum, token) => sum + Number(token.amount || 0), 0)), detail: 'Total earnings' },
  ], [tokens]);

  const handleCreateToken = () => {
    const amountNumber = Number(String(formData.amount).replace(/[^\d.]/g, '')) || 0;
    setTokens((current) => [{
      id: formData.token,
      vehicle: formData.vehicle,
      type: formData.type,
      status: formData.status,
      duration: formData.duration,
      amount: amountNumber,
    }, ...current]);
    setShowForm(false);
    setAlerts((current) => [
      {
        vehicle: formData.vehicle,
        overdue: 'New token created',
        audience: 'Owner alert',
        severity: 'low',
      },
      ...current,
    ]);
  };

  const handleLogout = () => {
    clearDemoUser();
    router.push('/login');
  };

  return (
    <main className="dashboard-shell">
      <div className="topbar-row">
        <div className="dashboard-header">
          <div>
            <p className="eyebrow">Railway operations</p>
            <h1>Railway Token System</h1>
          </div>
          <div className="user-badge">{user.role}</div>
        </div>
      </div>

      <div className="nav-row">
        <Link href="/dashboard" className="nav-link active">Overview</Link>
        <Link href="/costs" className="nav-link">Costs</Link>
        <button className="ghost-btn" onClick={handleLogout}>Logout</button>
      </div>

      <section className="stats-grid" style={{ marginTop: '22px' }}>
        {stats.map((stat) => (
          <article key={stat.label} className="stat-card">
            <div className="stat-label">{stat.label}</div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-detail">{stat.detail}</div>
          </article>
        ))}
      </section>

      {showForm && (
        <div className="form-panel">
          <div className="section-header">
            <h3>Create Token</h3>
            <button className="ghost-btn" onClick={() => setShowForm(false)}>Close</button>
          </div>

          <div className="token-form">
            <div className="form-field">
              <label>Token No</label>
              <input value={formData.token} onChange={(event) => setFormData({ ...formData, token: event.target.value })} />
            </div>
            <div className="form-field">
              <label>Vehicle No</label>
              <input value={formData.vehicle} onChange={(event) => setFormData({ ...formData, vehicle: event.target.value })} />
            </div>
            <div className="form-field">
              <label>Type</label>
              <select value={formData.type} onChange={(event) => setFormData({ ...formData, type: event.target.value })}>
                <option>Car</option>
                <option>Bike</option>
              </select>
            </div>
            <div className="form-field">
              <label>Status</label>
              <select value={formData.status} onChange={(event) => setFormData({ ...formData, status: event.target.value })}>
                <option>Active</option>
                <option>Overdue</option>
                <option>Monthly Pass</option>
              </select>
            </div>
            <div className="form-field">
              <label>Duration</label>
              <input value={formData.duration} onChange={(event) => setFormData({ ...formData, duration: event.target.value })} />
            </div>
            <div className="form-field">
              <label>Amount</label>
              <input value={formData.amount} onChange={(event) => setFormData({ ...formData, amount: event.target.value })} />
            </div>
          </div>

          <div className="form-actions">
            <button className="ghost-btn" onClick={() => setShowForm(false)}>Cancel</button>
            <button className="primary-btn" onClick={handleCreateToken}>Save token</button>
          </div>
        </div>
      )}

      <section className="panel-grid">
        <article className="panel">
          <div className="panel-header">
            <h2>Active tokens</h2>
            <button className="primary-btn" onClick={() => setShowForm(true)}>+ Create Token</button>
          </div>
          <div className="table-wrap">
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
                {tokens.length ? tokens.map((entry) => (
                  <tr key={`${entry.id}-${entry.vehicle}`}>
                    <td>{entry.id}</td>
                    <td>{entry.vehicle}</td>
                    <td>{entry.type}</td>
                    <td><span className={`badge ${entry.status.toLowerCase().replace(/\s+/g, '-')}`}>{entry.status}</span></td>
                    <td>{entry.duration}</td>
                    <td>{formatCurrency(entry.amount)}</td>
                  </tr>
                )) : <tr><td colSpan="6" className="empty-state">No tokens found yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </article>

        <article className="panel">
          <div className="panel-header">
            <h2>Overdue alerts</h2>
          </div>
          <div className="alert-list">
            {alerts.map((alert) => (
              <div key={`${alert.vehicle}-${alert.audience}`} className={`alert-item ${alert.severity}`}>
                <div className="alert-head">
                  <strong>{alert.vehicle}</strong>
                  <span className="mini-badge">{alert.audience}</span>
                </div>
                <p>Exceeded allowance by {alert.overdue}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
