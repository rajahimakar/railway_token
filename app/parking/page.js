"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { clearDemoUser, readDemoUser } from '../../lib/auth';

const siteData = [
  { site: 'Site-A1', status: 'Active', occupied: 18, capacity: 20, zone: 'North bay', vacant: 2, vehicles: ['MH-12-BT-3498', 'MH-02-CD-5678'] },
  { site: 'Site-A2', status: 'Busy', occupied: 15, capacity: 18, zone: 'East lane', vacant: 3, vehicles: ['MH-10-RT-1188', 'MH-11-ST-9987'] },
  { site: 'Site-B1', status: 'Low load', occupied: 11, capacity: 16, zone: 'South plaza', vacant: 5, vehicles: ['MH-17-AB-4401'] },
  { site: 'Site-B2', status: 'Active', occupied: 7, capacity: 14, zone: 'West entry', vacant: 7, vehicles: ['MH-08-KL-7711'] },
];

const toneMap = {
  Active: 'good',
  Busy: 'warning',
  'Low load': 'low',
};

export default function ParkingPage() {
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

  const isOwner = user.role === 'SITE OWNER';

  const navTabs = useMemo(() => (
    isOwner
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
        ]
  ), [isOwner]);

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
        {navTabs.map((tab) => (
          <Link
            key={tab.label}
            href={tab.href}
            className={`nav-link ${tab.label === 'Parking' ? 'active' : ''}`}
          >
            {tab.label}
          </Link>
        ))}
        <button className="ghost-btn" onClick={handleLogout}>Logout</button>
      </div>

      <section className="stats-grid" style={{ marginTop: '20px' }}>
        <article className="stat-card">
          <div className="stat-label">Active lots</div>
          <div className="stat-value">4</div>
          <div className="stat-detail">Parking sites live</div>
        </article>

        <article className="stat-card">
          <div className="stat-label">Vehicles parked</div>
          <div className="stat-value">{siteData.reduce((sum, site) => sum + site.occupied, 0)}</div>
          <div className="stat-detail">Across all assigned sites</div>
        </article>

        <article className="stat-card">
          <div className="stat-label">Vacant bays</div>
          <div className="stat-value">{siteData.reduce((sum, site) => sum + site.vacant, 0)}</div>
          <div className="stat-detail">Open spaces for arrival</div>
        </article>
      </section>

      <section className="panel" style={{ marginTop: '12px', padding: '20px' }}>
        <div className="panel-header">
          <h2 style={{ margin: 0 }}>Parking board</h2>
          <span className="muted">Live site occupancy</span>
        </div>

        <div className="parking-layout">
          {siteData.map((site) => {
            const tone = toneMap[site.status] || 'good';
            return (
              <div key={site.site} className={`parking-slot ${tone}`}>
                <div className="parking-topline">
                  <strong>{site.site}</strong>
                  <span className={`site-badge ${tone}`}>{site.status}</span>
                </div>

                <div className="parking-meta">
                  <span>{site.zone}</span>
                  <span>{site.occupied}/{site.capacity}</span>
                </div>

                <div className="parking-bays">
                  {Array.from({ length: site.capacity }).map((_, index) => (
                    <span key={`${site.site}-${index}`} className={`parking-bay ${index < site.occupied ? 'occupied' : 'empty'}`} />
                  ))}
                </div>

                <div className="parking-meta">
                  <span>Occupied: {site.occupied}</span>
                  <span>Vacant: {site.vacant}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
