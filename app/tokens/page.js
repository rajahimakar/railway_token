"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { clearDemoUser, readDemoUser } from '../../lib/auth';

const tokenRows = [
  { id: '#A-102', vehicle: 'MH-12-BT-3498', entry: 'Bike', exit: '3:31:05 PM', status: 'Active', charges: '₹100', action: 'Complete' },
  { id: '#A-103', vehicle: 'MH-02-CD-5678', entry: 'Bike', exit: '25/9/2026', status: 'Active', charges: '₹2000', action: 'Complete' },
  { id: '#A-101', vehicle: 'MH-15-EF-2341', entry: 'Car', exit: '12:16:05 PM', status: 'Active', charges: '₹200', action: 'Complete' },
];

export default function TokensPage() {
  const router = useRouter();
  const [user, setUser] = useState({ role: 'SITE OWNER' });

  useEffect(() => {
    const savedUser = readDemoUser();
    if (!savedUser) {
      router.push('/login');
      return;
    }
    setUser(savedUser);
  }, [router]);

  const handleLogout = () => {
    clearDemoUser();
    router.push('/login');
  };

  return (
    <main className="dashboard-shell">
      <div className="topbar-row">
        <div className="dashboard-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="railway-mark" style={{ width: '34px', height: '34px', margin: 0, fontSize: '20px' }}>🚂</div>
              <h1 style={{ fontSize: '28px' }}>Railway Token System</h1>
            </div>
          </div>
          <div className="header-right">
            <span className="user-badge" style={{ background: 'rgba(255,255,255,0.16)' }}>{user.role}</span>
          </div>
        </div>
      </div>

      <div className="nav-row" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.18)' }}>
        <Link href="/dashboard" className="nav-link">Overview</Link>
        <Link href="/parking" className="nav-link">Parking</Link>
        <Link href="/tokens" className="nav-link active">Tokens</Link>
        <Link href="/costs" className="nav-link">Costs</Link>
        <Link href="/history" className="nav-link">History</Link>
        <button className="ghost-btn" onClick={handleLogout}>Logout</button>
      </div>

      <section className="panel" style={{ marginTop: '20px', padding: '24px 18px 18px' }}>
        <div className="panel-header">
          <h2 style={{ fontSize: '32px', margin: 0 }}>Token Management</h2>
          <button className="primary-btn" type="button">+ Issue New Token</button>
        </div>

        <div className="table-wrap">
          <table className="token-table">
            <thead>
              <tr>
                <th>Token Id</th>
                <th>Vehicle</th>
                <th>Entry</th>
                <th>Exit</th>
                <th>Status</th>
                <th>Charges</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tokenRows.map((row) => (
                <tr key={row.id}>
                  <td><strong>{row.id}</strong></td>
                  <td>{row.vehicle}</td>
                  <td>{row.entry}</td>
                  <td>{row.exit}</td>
                  <td><span className="token-chip">{row.status}</span></td>
                  <td>{row.charges}</td>
                  <td><button className="token-action-btn" type="button">{row.action}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
