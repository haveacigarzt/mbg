import { ApiError, apiFetch } from './client';
import type { FetchPesertaDidikResponse, FetchSekolahResponse, GetPesertaDidikParams, GetSekolahParams, PesertaDidikInput, PostPesertaDidikResponse, PostSekolah } from '../types/sekolah';

export async function getSekolah(params?: GetSekolahParams) {
  const searchParams = new URLSearchParams();

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.set(key, String(value));
    }
  });

  const response = await apiFetch(`/v1/sekolah?${searchParams.toString()}`);
  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('token_expiry');
  }

  if (!response.ok) {
    throw new Error('gagal mengambil sekolah');
  }

  const data: FetchSekolahResponse = await response.json();

  return data;
}

export async function updateSekolah(sekolah_id: number, input: PostSekolah) {
  const response = await apiFetch(`/v1/sekolah/${sekolah_id}`, {
    method: 'PATCH',
    body: JSON.stringify(input)
  });

  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('token_expiry');
  }
  if (!response.ok) {
    throw new Error('gagal update sekolah');
  }

  const data: FetchSekolahResponse = await response.json();

  return data.sekolah;
}

export async function createSekolah(input: PostSekolah) {
  const response = await apiFetch(`/v1/sekolah`, {
    method: 'POST',
    body: JSON.stringify(input)
  });
  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('token_expiry');
  }

  if (!response.ok) {
    throw new Error('gagal create sekolah');
  }

  const data: FetchSekolahResponse = await response.json();

  return data.sekolah;
}

export async function deleteSekolah(sekolah_id: number) {
  const response = await apiFetch(`/v1/sekolah/${sekolah_id}`, {
    method: 'DELETE'
  });
  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('token_expiry');
  }

  if (!response.ok) {
    throw new Error('gagal menghapus sekolah');
  }

  const data: FetchSekolahResponse = await response.json();

  return data.sekolah;
}

export async function getPesertaDidik(id: number, params?: GetPesertaDidikParams) {
  const searchParams = new URLSearchParams();

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.set(key, String(value));
    }
  });

  const response = await apiFetch(`/v1/sekolah/${id}/pesertadidik?${searchParams.toString()}`);
  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('token_expiry');
  }

  if (!response.ok) {
    throw new Error('gagal mengambil peserta didik');
  }

  const data: FetchPesertaDidikResponse = await response.json();

  return data;
}

export async function postPesertaDidik(sekolah_id: number, input: PesertaDidikInput) {
  const response = await apiFetch(`/v1/sekolah/${sekolah_id}/pesertadidik`, {
    method: 'POST',
    body: JSON.stringify(input)
  });

  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('token_expiry');
  }
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(data?.message || data?.error || 'Create peserta didik gagal', response.status, data);
  }

  return data as PostPesertaDidikResponse;
}
