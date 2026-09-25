"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { setDemoUser } from '../../lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [employeeId, setEmployeeId] = useState('siteowner');
  const [password, setPassword] = useState('railway123');
  const [message, setMessage] = useState('Demo access: siteowner / railway123');

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!employeeId.trim() || !password.trim()) {
      setMessage('Please enter both employee ID and access code.');
      return;
    }

    const normalizedId = employeeId.trim();
    const role = normalizedId.toLowerCase().includes('owner') ? 'SITE OWNER' : 'SITE EMPLOYEE';

    const user = {
      id: normalizedId,
      role,
      name: role === 'SITE OWNER' ? 'Owner Admin' : 'Station Employee',
    };

    setDemoUser(user);
    router.push('/dashboard');
  };

  return (
    <main className="login-screen">
      <div className="login-panel">
        <div className="login-brand">
          <div className="railway-mark">🚆</div>
          <div className="brand-label">Railway operations</div>
          <h3>Station access portal</h3>
          <p>
            Securely monitor token issuance, occupancy, cost oversight and overdue management
            from a single operational dashboard.
          </p>
          <ul>
            <li>Live parking status</li>
            <li>Vehicle token controls</li>
            <li>Revenue and cost oversight</li>
          </ul>
        </div>

        <div className="login-card">
          <div className="login-header">
            <span className="brand-badge">Protected access</span>
            <h2>Railway Token Login</h2>
            <p>Enter your secure credentials to continue.</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="employeeId">Employee ID</label>
              <input
                id="employeeId"
                value={employeeId}
                onChange={(event) => setEmployeeId(event.target.value)}
                placeholder="Enter employee ID"
              />
            </div>

            <div className="form-field">
              <label htmlFor="password">Access code</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter access code"
              />
            </div>

            <button type="submit" className="login-submit">Sign in</button>
            <div className="login-message">{message}</div>
          </form>
        </div>
      </div>
    </main>
  );
}
