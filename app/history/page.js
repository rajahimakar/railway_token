"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { clearDemoUser, readDemoUser } from '../../lib/auth';

const historySeed = [
  { date: '2026-09-24', token: '#A-100', vehicle: 'MH-12-XY-1234', entry: '08:30 AM', exit: '10:15 AM', duration: '1h 45m', amount: '₹60', paymentStatus: 'Completed' },
  { date: '2026-09-24', token: '#A-99', vehicle: 'KA-05-GH-4567', entry: '07:00 AM', exit: '09:30 AM', duration: '2h 30m', amount: '₹110', paymentStatus: 'Completed' },
  { date: '2026-09-25', token: '#A-88', vehicle: 'TN-07-FE-2345', entry: '06:45 AM', exit: '08:15 AM', duration: '1h 30m', amount: '₹90', paymentStatus: 'Completed' },
];

export default function HistoryPage() {
  const router = useRouter();
  const [user, setUser] = useState({ role: 'SITE OWNER' });
  const [search, setSearch] = useState('');

  useEffect(() => {
    const savedUser = readDemoUser();
    if (!savedUser) {
      router.push('/login');
      return;
    }
    setUser(savedUser);
  }, [router]);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return historySeed;
    return historySeed.filter((row) => [row.token, row.vehicle, row.date].some((value) => value.toLowerCase().includes(q)));
  }, [search]);

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
              <h1 style={{ fontSize: '28px' }}>Parking Token System</h1>
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
        <Link href="/tokens" className="nav-link">Tokens</Link>
        <Link href="/costs" className="nav-link">Costs</Link>
        <Link href="/history" className="nav-link active">History</Link>
        <button className="ghost-btn" onClick={handleLogout}>Logout</button>
      </div>

      <section className="panel" style={{ marginTop: '20px', padding: '24px 18px 18px' }}>
        <div className="panel-header">
          <h2 style={{ fontSize: '32px', margin: 0 }}>Complete History</h2>
          <input
            className="history-search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search transactions..."
            aria-label="Search transactions"
          />
        </div>

        <div className="table-wrap">
          <table className="history-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Token</th>
                <th>Vehicle</th>
                <th>Entry</th>
                <th>Exit</th>
                <th>Duration</th>
                <th>Amount Paid</th>
                <th>Payment Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => (
                <tr key={`${row.date}-${row.token}`}>
                  <td>{row.date}</td>
                  <td><span className="token-chip" style={{ minWidth: '86px' }}>{row.token}</span></td>
                  <td>{row.vehicle}</td>
                  <td>{row.entry}</td>
                  <td>{row.exit}</td>
                  <td>{row.duration}</td>
                  <td>{row.amount}</td>
                  <td><span className="history-chip">{row.paymentStatus}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
