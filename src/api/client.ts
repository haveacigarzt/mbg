// api/client.ts
export async function apiFetch(path: string, init?: RequestInit) {
  return fetch(`/api${path}`, init);
}
