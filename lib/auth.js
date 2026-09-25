export const DEMO_SESSION_COOKIE = 'railway-demo-session';

export function readDemoUser() {
  if (typeof window === 'undefined') return null;

  const stored = localStorage.getItem('railway-demo-user');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }

  const cookies = document.cookie.split('; ').reduce((accumulator, item) => {
    const [key, value] = item.split('=');
    if (key && value) accumulator[key] = decodeURIComponent(value);
    return accumulator;
  }, {});

  const session = cookies[DEMO_SESSION_COOKIE];
  if (!session) return null;

  try {
    return JSON.parse(session);
  } catch {
    return null;
  }
}

export function setDemoUser(user) {
  if (typeof window === 'undefined') return;

  localStorage.setItem('railway-demo-user', JSON.stringify(user));

  const secureFlag = process.env.NEXT_PUBLIC_APP_ENV === 'production' ? '; Secure' : '';
  document.cookie = `${DEMO_SESSION_COOKIE}=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=86400; SameSite=Lax${secureFlag}`;
}

export function clearDemoUser() {
  if (typeof window === 'undefined') return;

  localStorage.removeItem('railway-demo-user');
  document.cookie = `${DEMO_SESSION_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}
