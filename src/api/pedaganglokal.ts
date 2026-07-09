import type { FetchPedagangLokalResponse, GetPedagangLokalParams } from '@/types/pedaganglokal';
import { apiFetch } from './client';

export async function getPedagangLokal(params?: GetPedagangLokalParams) {
  const searchParams = new URLSearchParams();

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.set(key, String(value));
    }
  });

  const response = await apiFetch(`/v1/pedaganglokal?${searchParams.toString()}`);
  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('token_expiry');
  }

  if (!response.ok) {
    throw new Error('gagal mengambil sekolah');
  }

  const data: FetchPedagangLokalResponse = await response.json();

  return data;
}
