export async function backendFetch<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  // We call our own proxy so the browser never hits Zach backend directly.
  const res = await fetch(`/api/_proxy${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Backend error ${res.status}: ${text}`);
  }

  return res.json() as Promise<T>;
}
