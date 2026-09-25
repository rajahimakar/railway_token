"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { clearDemoUser, readDemoUser } from '../../lib/auth';

const defaultCosts = {
  bikeHourly: 20,
  bikeDaily: 100,
  carHourly: 40,
  carDaily: 200,
  monthlyPass: 2000,
  graceMinutes: 10,
};

export default function CostsPage() {
  const router = useRouter();
  const [user, setUser] = useState({ role: 'SITE OWNER' });
  const [costs, setCosts] = useState(defaultCosts);

  useEffect(() => {
    const savedUser = readDemoUser();
    if (!savedUser) {
      router.push('/login');
      return;
    }
    setUser(savedUser);
  }, [router]);

  const updateCost = (field, value) => {
    setCosts((current) => ({ ...current, [field]: Number(value) || 0 }));
  };

  return (
    <main className="dashboard-shell">
      <div className="topbar-row">
        <div className="dashboard-header">
          <div>
            <p className="eyebrow">Owner operations</p>
            <h1>Cost Management</h1>
          </div>
          <div className="user-badge">{user.role}</div>
        </div>
      </div>

      <div className="nav-row">
        <Link href="/dashboard" className="nav-link">Overview</Link>
        <Link href="/costs" className="nav-link active">Costs</Link>
        <button className="ghost-btn" onClick={() => {
          clearDemoUser();
          router.push('/login');
        }}>Logout</button>
      </div>

      <section className="cost-panel" style={{ marginTop: '24px' }}>
        <div className="section-header">
          <h2>Current pricing</h2>
          <span className="muted">Owner review</span>
        </div>

        <div className="cost-grid">
          <div className="cost-card">
            <h4>Bike 1 Hour</h4>
            <strong>₹{costs.bikeHourly}</strong>
          </div>
          <div className="cost-card">
            <h4>Bike 24 Hours</h4>
            <strong>₹{costs.bikeDaily}</strong>
          </div>
          <div className="cost-card">
            <h4>Car 1 Hour</h4>
            <strong>₹{costs.carHourly}</strong>
          </div>
          <div className="cost-card">
            <h4>Car 24 Hours</h4>
            <strong>₹{costs.carDaily}</strong>
          </div>
          <div className="cost-card">
            <h4>Monthly Pass</h4>
            <strong>₹{costs.monthlyPass}</strong>
          </div>
          <div className="cost-card">
            <h4>Grace period</h4>
            <strong>{costs.graceMinutes} min</strong>
          </div>
        </div>
      </section>

      <section className="form-panel" style={{ marginTop: '24px' }}>
        <div className="section-header">
          <h3>Owner update</h3>
        </div>

        <div className="token-form">
          <div className="form-field">
            <label>Bike hourly</label>
            <input value={costs.bikeHourly} onChange={(event) => updateCost('bikeHourly', event.target.value)} />
          </div>
          <div className="form-field">
            <label>Bike daily</label>
            <input value={costs.bikeDaily} onChange={(event) => updateCost('bikeDaily', event.target.value)} />
          </div>
          <div className="form-field">
            <label>Car hourly</label>
            <input value={costs.carHourly} onChange={(event) => updateCost('carHourly', event.target.value)} />
          </div>
          <div className="form-field">
            <label>Car daily</label>
            <input value={costs.carDaily} onChange={(event) => updateCost('carDaily', event.target.value)} />
          </div>
          <div className="form-field">
            <label>Monthly pass</label>
            <input value={costs.monthlyPass} onChange={(event) => updateCost('monthlyPass', event.target.value)} />
          </div>
          <div className="form-field">
            <label>Grace minutes</label>
            <input value={costs.graceMinutes} onChange={(event) => updateCost('graceMinutes', event.target.value)} />
          </div>
        </div>

        <div className="form-actions">
          <button className="ghost-btn" type="button">Reset</button>
          <button className="primary-btn" type="button">Save changes</button>
        </div>
      </section>
    </main>
  );
}
