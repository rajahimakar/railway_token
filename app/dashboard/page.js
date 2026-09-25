"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { clearDemoUser, readDemoUser } from '../../lib/auth';
import {
  buildNotificationsForTokens,
  defaultCosts,
  readResolvedNotifications,
  readStoredCosts,
  readStoredNotifications,
  saveStoredNotifications,
} from '../../lib/demo-business';

const starterTokens = [
  { id: 'A-102', vehicle: 'MH-12-BT-3498', type: 'Bike', status: 'Active', duration: '1h 20m', paidDuration: '1h 00m', amount: 40 },
  { id: 'A-103', vehicle: 'MH-02-CD-5678', type: 'Bike', status: 'Monthly Pass', duration: '12d remaining', paidDuration: '12d', amount: 2000 },
  { id: 'A-101', vehicle: 'MH-15-EF-2341', type: 'Car', status: 'Overdue', duration: '1h 45m', paidDuration: '1h 20m', amount: 120 },
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
  const [user, setUser] = useState({ role: 'SITE EMPLOYEE', name: 'Station Employee' });
  const [tokens, setTokens] = useState(starterTokens);
  const [alerts, setAlerts] = useState(starterAlerts);
  const [notifications, setNotifications] = useState([]);
  const [resolvedCount, setResolvedCount] = useState(0);
  const [toast, setToast] = useState('');
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
    const storedNotifications = readStoredNotifications();
    setNotifications(storedNotifications);
    setResolvedCount(readResolvedNotifications().length);
  }, [router]);

  useEffect(() => {
    const storedCosts = readStoredCosts();
    const generated = buildNotificationsForTokens(tokens, storedCosts);
    const merged = [...generated, ...readStoredNotifications()].slice(0, 10);
    setNotifications(merged);
    saveStoredNotifications(merged);
  }, [tokens]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(''), 2600);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (user.role !== 'SITE OWNER') {
      setShowForm(false);
    }
  }, [user.role]);

  const isOwner = user.role === 'SITE OWNER';
  const notificationCount = notifications.length;

  const navTabs = isOwner
    ? [
        { label: 'Overview', href: '/dashboard' },
        { label: 'Parking', href: '/parking' },
        { label: 'Tokens', href: '/tokens' },
        { label: 'Costs', href: '/costs' },
        { label: 'History', href: '/history' },
      ]
    : [
        { label: 'Overview', href: '/dashboard' },
        { label: 'Parking', href: '/parking' },
        { label: 'Tokens', href: '/tokens' },
        { label: 'History', href: '/history' },
      ];

  const stats = useMemo(() => [
    { label: 'Active Tokens', value: String(tokens.filter((token) => token.status === 'Active').length), detail: 'Currently in use' },
    { label: 'Parked Vehicles', value: String(tokens.filter((token) => token.status === 'Active').length), detail: 'At parking spot' },
    { label: "Today's Total", value: String(tokens.length), detail: 'Vehicles passed today' },
    { label: "Today's Revenue", value: formatCurrency(tokens.reduce((sum, token) => sum + Number(token.amount || 0), 0)), detail: 'Total earnings' },
  ], [tokens]);

  const handleCreateToken = () => {
    const amountNumber = Number(String(formData.amount).replace(/[^\d.]/g, '')) || 0;
    const nextToken = {
      id: formData.token,
      vehicle: formData.vehicle,
      type: formData.type,
      status: formData.status,
      duration: formData.duration,
      paidDuration: formData.duration,
      amount: amountNumber,
    };

    setTokens((current) => [nextToken, ...current]);
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

    const currentCosts = readStoredCosts() || defaultCosts;
    const generated = buildNotificationsForTokens([nextToken], currentCosts);
    if (generated.length) {
      setToast(generated[0].message);
    }
  };

  const handleLogout = () => {
    clearDemoUser();
    router.push('/login');
  };

  return (
    <main className="dashboard-shell">
      {toast && <div className="toast-banner">{toast}</div>}
      <div className="topbar-row">
        <div className="dashboard-header">
          <div>
            <p className="eyebrow">Railway operations</p>
            <h1>Railway Token System</h1>
          </div>
          <div className="header-right">
            <span className="notification-chip">Open alerts {notificationCount}</span>
            <span className="notification-chip">Resolved {resolvedCount}</span>
            <div className="user-badge">{user.role}</div>
          </div>
        </div>
      </div>

      <div className="nav-row">
        {navTabs.map((tab) => (
          <Link
            key={tab.label}
            href={tab.href}
            className={`nav-link ${tab.label === 'Overview' ? 'active' : ''}`}
          >
            {tab.label}
          </Link>
        ))}
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
            {isOwner && (
              <button className="primary-btn" onClick={() => setShowForm(true)}>+ Create Token</button>
            )}
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
            {notifications.slice(0, 3).map((notification) => (
              <div key={notification.id} className={`alert-item ${notification.severity}`}>
                <div className="alert-head">
                  <strong>{notification.vehicle}</strong>
                  <span className="mini-badge">{notification.audience}</span>
                </div>
                <p>{notification.message}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
