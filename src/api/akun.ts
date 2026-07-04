import type { FetchAkunResponse, FetchUsersSummaryResponse, GetAkunParams, PostAkunInput } from '@/types/akun';
import { ApiError, apiFetch } from './client';

export async function getAkun(params?: GetAkunParams) {
  const searchParams = new URLSearchParams();

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.set(key, String(value));
    }
  });
  const response = await apiFetch(`/v1/admin/akun?${searchParams.toString()}`);

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(data?.message || data?.error || 'Ambil akun gagal', response.status, data);
  }

  return data as FetchAkunResponse;
}

export async function getUsersSummary() {
  const response = await apiFetch(`/v1/admin/akun/summary`);

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(data?.message || data?.error || 'Ambil users summary gagal', response.status, data);
  }

  const result = data as FetchUsersSummaryResponse;
  return result.summary;
}

export async function createUser(input: PostAkunInput) {
  const response = await apiFetch(`/v1/admin/akun`, {
    method: 'POST',
    body: JSON.stringify(input)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(data?.message || data?.error || 'Create user gagal', response.status, data);
  }
}

export async function updateAktivasiUser(id: number, activated: boolean) {
  const response = await apiFetch(`/v1/admin/akun`, {
    method: 'PATCH',
    body: JSON.stringify({ id, activated })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(data?.message || data?.error || 'Update user gagal', response.status, data);
  }
}

export async function deleteUser(id: number) {
  const response = await apiFetch(`/v1/admin/akun`, {
    method: 'DELETE',
    body: JSON.stringify({ id })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(data?.message || data?.error || 'Delete user gagal', response.status, data);
  }
}
