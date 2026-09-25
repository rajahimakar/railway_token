"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { clearDemoUser, readDemoUser } from '../../lib/auth';
import { readStoredTokens, siteLayouts } from '../../lib/demo-business';

const toneMap = {
  Active: 'good',
  Busy: 'warning',
  'Low load': 'low',
};

export default function ParkingPage() {
  const router = useRouter();
  const [user, setUser] = useState({ role: 'SITE OWNER' });
  const [tokens, setTokens] = useState([]);

  useEffect(() => {
    const savedUser = readDemoUser();
    if (!savedUser) {
      router.push('/login');
      return;
    }

    const loadTokens = async () => {
      try {
        const response = await fetch('/api/tokens');
        if (response.ok) {
          const data = await response.json();
          const rows = Array.isArray(data?.tokens) ? data.tokens : [];
          if (rows.length > 0) {
            setTokens(rows);
            return;
          }
        }
      } catch {
        // fall back to demo storage when Supabase is not configured
      }

      setTokens(readStoredTokens().length ? readStoredTokens() : [
        { id: 'A-102', vehicle: 'MH-12-BT-3498', site: 'Site-A1', slot: 1 },
        { id: 'A-103', vehicle: 'MH-02-CD-5678', site: 'Site-A1', slot: 2 },
        { id: 'A-101', vehicle: 'MH-15-EF-2341', site: 'Site-A2', slot: 1 },
      ]);
    };

    setUser(savedUser);
    loadTokens();
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

  const siteData = useMemo(() => siteLayouts.map((layout) => {
    const occupiedTokens = tokens.filter((token) => token.site === layout.site && token.status !== 'Completed');
    const capacity = layout.capacity;
    const slotMap = {};
    occupiedTokens.forEach((token) => {
      slotMap[token.slot] = token;
    });
    const occupied = occupiedTokens.length;
    const vacant = capacity - occupied;
    const status = occupied >= capacity * 0.8 ? (occupied >= capacity ? 'Busy' : 'Active') : 'Low load';

    return {
      site: layout.site,
      status: occupied >= capacity * 0.8 ? 'Busy' : (vacant > capacity * 0.35 ? 'Active' : 'Low load'),
      occupied,
      capacity,
      vacant,
      zone: layout.site === 'Site-A1' ? 'North bay' : layout.site === 'Site-A2' ? 'East lane' : layout.site === 'Site-B1' ? 'South plaza' : 'West entry',
      slots: Array.from({ length: capacity }, (_, index) => {
        const slotNumber = index + 1;
        return {
          slotNumber,
          token: slotMap[slotNumber] || null,
          occupied: Boolean(slotMap[slotNumber]),
        };
      }),
    };
  }), [tokens]);

  const handleLogout = () => {
    clearDemoUser();
    router.push('/login');
  };

  return (
    <main className="dashboard-shell">
      <div className="topbar-row">
        <div className="dashboard-header">
          <div>
            <div className="brand-inline-row">
              <div className="railway-mark">🚂</div>
              <h1>Parking Token System</h1>
            </div>
          </div>
          <div className="header-right">
            <span className="user-badge">{user.role}</span>
          </div>
        </div>
      </div>

      <div className="nav-row">
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
          <div className="stat-value">{siteData.length}</div>
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
                  {site.slots.map((slot) => (
                    <div key={`${site.site}-slot-${slot.slotNumber}`} className={`parking-bay ${slot.occupied ? 'occupied' : 'empty'}`} title={slot.occupied ? `${slot.token.id} - ${site.site}` : `Empty slot ${slot.slotNumber}`}>
                      {slot.occupied ? <span className="slot-token-tag">{slot.token.id}</span> : null}
                    </div>
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
