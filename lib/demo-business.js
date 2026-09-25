export const DEMO_COST_KEY = 'railway-demo-costs';
export const DEMO_NOTIFICATION_KEY = 'railway-demo-notifications';
export const DEMO_RESOLVED_KEY = 'railway-demo-resolved-vehicles';
export const DEMO_RESOLVED_NOTIFICATIONS_KEY = 'railway-demo-resolved-notifications';
export const DEMO_TOKENS_KEY = 'railway-demo-tokens';

export const siteLayouts = [
  { site: 'Site-A1', capacity: 20 },
  { site: 'Site-A2', capacity: 18 },
  { site: 'Site-B1', capacity: 16 },
  { site: 'Site-B2', capacity: 14 },
];

export const defaultCosts = {
  bikeHourly: 20,
  bikeDaily: 100,
  carHourly: 40,
  carDaily: 200,
  monthlyPass: 2000,
  graceMinutes: 10,
};

export function readStoredTokens() {
  if (typeof window === 'undefined') return [];

  const raw = localStorage.getItem(DEMO_TOKENS_KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveStoredTokens(tokens) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(DEMO_TOKENS_KEY, JSON.stringify(tokens));
}

export function assignTokenSlot(nextToken, existingTokens = []) {
  const sitePlan = [...siteLayouts];

  for (const site of sitePlan) {
    const occupiedSlots = new Set(
      existingTokens
        .filter((token) => token.site === site.site && token.slot)
        .map((token) => Number(token.slot))
    );

    for (let slot = 1; slot <= site.capacity; slot += 1) {
      if (!occupiedSlots.has(slot)) {
        return { ...nextToken, site: site.site, slot };
      }
    }
  }

  return { ...nextToken, site: 'Site-A1', slot: 1 };
}

export function readStoredCosts() {
  if (typeof window === 'undefined') return defaultCosts;

  const raw = localStorage.getItem(DEMO_COST_KEY);
  if (!raw) return defaultCosts;

  try {
    return { ...defaultCosts, ...JSON.parse(raw) };
  } catch {
    return defaultCosts;
  }
}

export function saveStoredCosts(costs) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(DEMO_COST_KEY, JSON.stringify(costs));
}

export function parseDurationMinutes(value) {
  if (!value || typeof value !== 'string') return 0;

  const normalized = value.toLowerCase().replace(/,/g, ' ');
  const hours = normalized.match(/(\d+)h/);
  const minutes = normalized.match(/(\d+)m/);
  const days = normalized.match(/(\d+)d/);

  let total = 0;

  if (days) total += Number(days[1]) * 24 * 60;
  if (hours) total += Number(hours[1]) * 60;
  if (minutes) total += Number(minutes[1]);

  if (total === 0 && normalized.includes('remaining')) {
    const remainingMinutes = normalized.match(/(\d+)\s*min/);
    if (remainingMinutes) return Number(remainingMinutes[1]);
  }

  return total;
}

export function buildNotificationsForTokens(tokens, costs = defaultCosts) {
  const graceMinutes = Number(costs.graceMinutes || 10);

  const notifications = [];

  tokens.forEach((token) => {
    if (!token || token.status === 'Monthly Pass') return;

    const paidMinutes = parseDurationMinutes(token.paidDuration || token.duration || '0m');
    const elapsedMinutes = parseDurationMinutes(token.duration || '0m');
    const thresholdMinutes = paidMinutes + graceMinutes;
    const overdueAfterGrace = Math.max(elapsedMinutes - thresholdMinutes, 0);

    if (overdueAfterGrace <= 0) return;

    const ownerMessage = `${token.vehicle} exceeded the paid duration by ${overdueAfterGrace} min after the ${graceMinutes}-min grace window. Owner review required.`;
    const employeeMessage = `${token.vehicle} is now overdue by ${overdueAfterGrace} min beyond the paid window and grace period. Please follow up with the owner.`;

    notifications.push({
      id: `${token.id}-${token.vehicle}-owner`,
      audience: 'Owner',
      title: 'Overdue vehicle alert',
      message: ownerMessage,
      vehicle: token.vehicle,
      tokenId: token.id,
      severity: overdueAfterGrace >= 30 ? 'high' : 'medium',
      createdAt: new Date().toISOString(),
      type: 'owner',
    });

    notifications.push({
      id: `${token.id}-${token.vehicle}-employee`,
      audience: 'Employee',
      title: 'Action required',
      message: employeeMessage,
      vehicle: token.vehicle,
      tokenId: token.id,
      severity: overdueAfterGrace >= 30 ? 'high' : 'low',
      createdAt: new Date().toISOString(),
      type: 'employee',
    });
  });

  return notifications.slice(0, 8);
}

export function readStoredNotifications() {
  if (typeof window === 'undefined') return [];

  const raw = localStorage.getItem(DEMO_NOTIFICATION_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    const resolved = readResolvedVehicles();
    return Array.isArray(parsed) ? parsed.filter((item) => !resolved.includes(item.vehicle)) : [];
  } catch {
    return [];
  }
}

export function saveStoredNotifications(notifications) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(DEMO_NOTIFICATION_KEY, JSON.stringify(notifications));
}

export function readResolvedNotifications() {
  if (typeof window === 'undefined') return [];

  const raw = localStorage.getItem(DEMO_RESOLVED_NOTIFICATIONS_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    const items = Array.isArray(parsed) ? parsed : [];
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return items.filter((item) => new Date(item.resolvedAt || item.createdAt).getTime() >= sevenDaysAgo);
  } catch {
    return [];
  }
}

export function saveResolvedNotifications(notifications) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(DEMO_RESOLVED_NOTIFICATIONS_KEY, JSON.stringify(notifications));
}

export function readResolvedVehicles() {
  if (typeof window === 'undefined') return [];

  const raw = localStorage.getItem(DEMO_RESOLVED_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveResolvedVehicles(vehicles) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(DEMO_RESOLVED_KEY, JSON.stringify(vehicles));
}

export function markVehicleResolved(vehicle) {
  const next = Array.from(new Set([...readResolvedVehicles(), vehicle]));
  saveResolvedVehicles(next);
  return next;
}

export function resolveNotification(notificationId) {
  const current = readStoredNotifications();
  const item = current.find((notification) => notification.id === notificationId);

  if (item) {
    markVehicleResolved(item.vehicle);
    const resolved = readResolvedNotifications();
    const resolvedItem = {
      ...item,
      resolvedAt: new Date().toISOString(),
      status: 'Resolved',
    };
    saveResolvedNotifications([...resolved, resolvedItem]);
  }

  const next = current.filter((notification) => notification.id !== notificationId);
  saveStoredNotifications(next);
  return next;
}
