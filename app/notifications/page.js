"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { clearDemoUser, readDemoUser } from '../../lib/auth';
import {
  readResolvedNotifications,
  readStoredNotifications,
  resolveNotification,
  saveStoredNotifications,
} from '../../lib/demo-business';

export default function NotificationsPage() {
  const router = useRouter();
  const [user, setUser] = useState({ role: 'SITE EMPLOYEE' });
  const [notifications, setNotifications] = useState([]);
  const [resolvedNotifications, setResolvedNotifications] = useState([]);
  const resolvedCount = resolvedNotifications.length;

  useEffect(() => {
    const savedUser = readDemoUser();
    if (!savedUser) {
      router.push('/login');
      return;
    }

    setUser(savedUser);
    setNotifications(readStoredNotifications());
    setResolvedNotifications(readResolvedNotifications());
  }, [router]);

  const grouped = useMemo(() => {
    const owner = notifications.filter((entry) => entry.audience === 'Owner');
    const employee = notifications.filter((entry) => entry.audience === 'Employee');
    return { owner, employee };
  }, [notifications]);

  const handleLogout = () => {
    clearDemoUser();
    router.push('/login');
  };

  const handleResolve = (notificationId) => {
    const next = resolveNotification(notificationId);
    setNotifications(next);
    setResolvedNotifications(readResolvedNotifications());
    saveStoredNotifications(next);
  };

  return (
    <main className="dashboard-shell">
      <div className="topbar-row">
        <div className="dashboard-header">
          <div>
            <p className="eyebrow">Operations centre</p>
            <h1>Notification centre</h1>
          </div>
          <div className="header-right">
            <span className="notification-chip">Resolved {resolvedCount}</span>
            <div className="user-badge">{user.role}</div>
          </div>
        </div>
      </div>

      <div className="nav-row">
        <Link href="/dashboard" className="nav-link">Overview</Link>
        <Link href="/costs" className="nav-link">Costs</Link>
        <Link href="/overdue" className="nav-link">Overdue</Link>
        <Link href="/notifications" className="nav-link active">Notifications</Link>
        <button className="ghost-btn" onClick={handleLogout}>Logout</button>
      </div>

      <section className="panel-grid" style={{ marginTop: '20px' }}>
        <article className="panel">
          <div className="panel-header">
            <h2>Owner notifications</h2>
          </div>

          {grouped.owner.length ? grouped.owner.map((item) => (
            <div key={item.id} className={`notification-card ${item.severity}`}>
              <div className="notification-head">
                <strong>{item.title}</strong>
                <span className="mini-badge">{item.audience}</span>
              </div>
              <p>{item.message}</p>
              <small>{item.vehicle} · {new Date(item.createdAt).toLocaleString()}</small>
              <div className="form-actions compact-actions">
                <button className="primary-btn small-btn" type="button" onClick={() => handleResolve(item.id)}>Mark as resolved</button>
              </div>
            </div>
          )) : <p className="empty-state">No owner notifications right now.</p>}
        </article>

        <article className="panel">
          <div className="panel-header">
            <h2>Employee notifications</h2>
          </div>

          {grouped.employee.length ? grouped.employee.map((item) => (
            <div key={item.id} className={`notification-card ${item.severity}`}>
              <div className="notification-head">
                <strong>{item.title}</strong>
                <span className="mini-badge">{item.audience}</span>
              </div>
              <p>{item.message}</p>
              <small>{item.vehicle} · {new Date(item.createdAt).toLocaleString()}</small>
              <div className="form-actions compact-actions">
                <button className="primary-btn small-btn" type="button" onClick={() => handleResolve(item.id)}>Mark as resolved</button>
              </div>
            </div>
          )) : <p className="empty-state">No employee notifications right now.</p>}
        </article>
      </section>

      <section className="panel" style={{ marginTop: '20px' }}>
        <div className="panel-header">
          <h2>Resolved / Closed</h2>
        </div>

        {resolvedNotifications.length ? resolvedNotifications.map((item) => (
          <div key={`${item.id}-resolved`} className="notification-card resolved">
            <div className="notification-head">
              <strong>{item.title}</strong>
              <span className="mini-badge resolved-badge">Resolved</span>
            </div>
            <p>{item.message}</p>
            <small>{item.vehicle} · resolved {new Date(item.resolvedAt).toLocaleString()}</small>
          </div>
        )) : <p className="empty-state">No resolved items yet.</p>}
      </section>
    </main>
  );
}
