import type { FetchPendudukResponse } from '@/types/penduduk';
import { apiFetch } from './client';
import type { PesertaDidik } from '@/types/sekolah';

export async function getPendudukByNIK(nik: string) {
  const response = await apiFetch(`/v1/penduduk/${nik}`);
  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('token_expiry');
  }

  if (!response.ok) {
    throw new Error('gagal mengambil penduduk by NIK');
  }

  const data: FetchPendudukResponse = await response.json();

  return data;
}

export async function getPesertaDidikByNISN(nisn: string) {
  const response = await apiFetch(`/v1/pesertadidikbynisn/${nisn}`);
  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('token_expiry');
  }

  if (!response.ok) {
    throw new Error('gagal mengambil peserta didik by NISN');
  }

  const data: { peserta_didik: PesertaDidik } = await response.json();

  return data;
}

export async function getPesertaDidikByPID(id: string) {
  const response = await apiFetch(`/v1/pesertadidik/${id}`);
  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('token_expiry');
  }

  if (!response.ok) {
    throw new Error('gagal mengambil peserta didik by ID');
  }

  const data: { peserta_didik: PesertaDidik } = await response.json();

  return data;
}
