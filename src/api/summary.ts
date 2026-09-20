import { apiFetch } from './client';
import type { SummaryDapur, SummaryPenerimaManfaat } from '@/types/summary';

export async function getSummaryPenerimaManfaat() {
  const response = await apiFetch(`/v1/summary/penerimamanfaat`);
  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('token_expiry');
  }

  if (!response.ok) {
    throw new Error('gagal mengambil summary penerima manfaat');
  }

  const data: SummaryPenerimaManfaat = await response.json();

  return data.summary_penerima_manfaat;
}

export async function getSummaryDapur() {
  const response = await apiFetch(`/v1/summary/dapur`);
  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('token_expiry');
  }

  if (!response.ok) {
    throw new Error('gagal mengambil summary dapur');
  }

  const data: SummaryDapur = await response.json();

  return data.summary_dapur;
}
