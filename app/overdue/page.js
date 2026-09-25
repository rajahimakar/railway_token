"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { clearDemoUser, readDemoUser } from '../../lib/auth';

const overdueSeed = [
  { vehicle: 'MH-15-EF-2341', token: 'A-101', type: 'Car', duration: '1h 45m', amount: 120, over: '25 min', status: 'Pending owner review' },
  { vehicle: 'MH-12-BT-3498', token: 'A-102', type: 'Bike', duration: '1h 20m', amount: 40, over: '10 min', status: 'Employee action needed' },
  { vehicle: 'MH-08-KL-7711', token: 'A-108', type: 'Bike', duration: '2h 10m', amount: 60, over: '40 min', status: 'Owner alert' },
];

export default function OverduePage() {
  const router = useRouter();
  const [user, setUser] = useState({ role: 'SITE EMPLOYEE' });
  const [items, setItems] = useState(overdueSeed);

  useEffect(() => {
    const savedUser = readDemoUser();
    if (!savedUser) {
      router.push('/login');
      return;
    }
    setUser(savedUser);
  }, [router]);

  const isOwner = user.role === 'SITE OWNER';

  const navTabs = isOwner
    ? [
        { label: 'Overview', href: '/dashboard' },
        { label: 'Parking', href: '/parking' },
        { label: 'Tokens', href: '/tokens' },
        { label: 'Costs', href: '/costs' },
        { label: 'Overdue', href: '/overdue' },
        { label: 'History', href: '/history' },
      ]
    : [
        { label: 'Overview', href: '/dashboard' },
        { label: 'Parking', href: '/parking' },
        { label: 'Tokens', href: '/tokens' },
        { label: 'Overdue', href: '/overdue' },
        { label: 'History', href: '/history' },
      ];

  const summary = useMemo(() => ({
    total: items.length,
    totalAmount: items.reduce((sum, entry) => sum + Number(entry.amount || 0), 0),
  }), [items]);

  const handleResolve = (vehicle) => {
    setItems((current) => current.filter((entry) => entry.vehicle !== vehicle));
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
            <h1>{isOwner ? 'Owner overdue review' : 'Employee overdue queue'}</h1>
          </div>
          <div className="user-badge">{user.role}</div>
        </div>
      </div>

      <div className="nav-row">
        {navTabs.map((tab) => (
          <Link
            key={tab.label}
            href={tab.href}
            className={`nav-link ${tab.label === 'Overdue' ? 'active' : ''}`}
          >
            {tab.label}
          </Link>
        ))}
        <Link href="/notifications" className="nav-link">Notifications</Link>
        <button className="ghost-btn" onClick={handleLogout}>Logout</button>
      </div>

      <section className="stats-grid" style={{ marginTop: '20px' }}>
        <article className="stat-card">
          <div className="stat-label">Overdue vehicles</div>
          <div className="stat-value">{summary.total}</div>
          <div className="stat-detail">Pending follow-up</div>
        </article>

        <article className="stat-card">
          <div className="stat-label">Outstanding amount</div>
          <div className="stat-value">₹{summary.totalAmount}</div>
          <div className="stat-detail">Unsettled charges</div>
        </article>

        <article className="stat-card">
          <div className="stat-label">Urgent review</div>
          <div className="stat-value">{items.filter((entry) => Number(entry.over.replace(/\D/g, '')) >= 25).length}</div>
          <div className="stat-detail">Vehicles beyond threshold</div>
        </article>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>{isOwner ? 'Owner review queue' : 'Employee action queue'}</h2>
          <span className="muted">Grace window after paid duration</span>
        </div>

        {isOwner ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Vehicle</th>
                  <th>Token</th>
                  <th>Duration</th>
                  <th>Over</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((entry) => (
                  <tr key={entry.vehicle}>
                    <td>{entry.vehicle}</td>
                    <td>{entry.token}</td>
                    <td>{entry.duration}</td>
                    <td>{entry.over}</td>
                    <td>₹{entry.amount}</td>
                    <td><span className="badge overdue">{entry.status}</span></td>
                    <td>
                      <div className="inline-actions">
                        <button className="primary-btn small-btn" onClick={() => handleResolve(entry.vehicle)}>Resolve</button>
                        <button className="ghost-btn small-btn" onClick={() => handleResolve(entry.vehicle)}>Notify</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="employee-overdue-list">
            {items.map((entry) => (
              <div key={entry.vehicle} className="overdue-item">
                <div className="overdue-topline">
                  <strong>{entry.vehicle}</strong>
                  <span className="badge overdue">{entry.over}</span>
                </div>
                <div className="overdue-meta">
                  <span>Token: {entry.token}</span>
                  <span>Type: {entry.type}</span>
                  <span>Duration: {entry.duration}</span>
                </div>
                <div className="overdue-meta">
                  <span>Amount: ₹{entry.amount}</span>
                  <span>Status: {entry.status}</span>
                </div>
                <div className="form-actions compact-actions">
                  <button className="ghost-btn small-btn" onClick={() => handleResolve(entry.vehicle)}>Mark checked</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
