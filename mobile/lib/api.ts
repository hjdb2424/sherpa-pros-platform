const API_BASE = __DEV__
  ? 'http://localhost:3001/api'
  : 'https://sherpa-pros-platform.vercel.app/api';

export async function apiFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }
    return res.json();
  } catch {
    // Silently fail — callers should have fallback mock data
    return {} as T;
  }
}
