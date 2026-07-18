let csrfTokenPromise: Promise<string | null> | null = null;

export async function adminFetch(url: string | URL | Request, options: RequestInit = {}): Promise<Response> {
  if (options.method && ['POST', 'PUT', 'DELETE'].includes(options.method.toUpperCase())) {
    if (!csrfTokenPromise) {
      csrfTokenPromise = fetch('/api/auth/csrf')
        .then(res => res.ok ? res.json() : null)
        .then(data => data?.csrfToken || null)
        .catch(err => {
          console.error('Failed to fetch CSRF token:', err);
          return null;
        });
    }

    const token = await csrfTokenPromise;

    if (token) {
      // Create headers object if it doesn't exist, or clone it
      const headers = new Headers(options.headers || {});
      headers.set('X-CSRF-Token', token);
      options.headers = headers;
    }
  }

  return fetch(url, options);
}
