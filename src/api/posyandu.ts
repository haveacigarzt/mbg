import { ApiError, apiFetch } from './client';
import type {
  BalitaInput,
  BumilInput,
  BusuiInput,
  FetchBalitaResponse,
  FetchBumilResponse,
  FetchBusuiResponse,
  FetchPendudukResponse,
  FetchPosyanduResponse,
  Get3BParams,
  GetPosyanduParams,
  PostBalitaResponse,
  PostBumilResponse,
  PostBusuiResponse,
  PostPosyandu
} from '../types/posyandu';

export async function getPosyandu(params?: GetPosyanduParams) {
  const searchParams = new URLSearchParams();

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.set(key, String(value));
    }
  });

  const response = await apiFetch(`/v1/posyandu?${searchParams.toString()}`);

  if (!response.ok) {
    throw new Error('gagal mengambil posyandu');
  }

  const data: FetchPosyanduResponse = await response.json();

  return data;
}

export async function createPosyandu(input: PostPosyandu) {
  const response = await apiFetch(`/v1/posyandu`, {
    method: 'POST',
    body: JSON.stringify(input)
  });

  if (!response.ok) {
    throw new Error('gagal create posyandu');
  }

  const data: FetchPosyanduResponse = await response.json();

  return data.posyandu;
}

export async function updatePosyandu(posyandu_id: number, input: PostPosyandu) {
  const response = await apiFetch(`/v1/posyandu/${posyandu_id}`, {
    method: 'PATCH',
    body: JSON.stringify(input)
  });

  if (!response.ok) {
    throw new Error('gagal update posyandu');
  }

  const data: FetchPosyanduResponse = await response.json();

  return data.posyandu;
}

export async function deletePosyandu(posyandu_id: number) {
  const response = await apiFetch(`/v1/posyandu/${posyandu_id}`, {
    method: 'DELETE'
  });

  if (!response.ok) {
    throw new Error('gagal menghapus posyandu');
  }

  const data: FetchPosyanduResponse = await response.json();

  return data.posyandu;
}

export async function getBalita(id: number, params?: Get3BParams) {
  const searchParams = new URLSearchParams();

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.set(key, String(value));
    }
  });

  const response = await apiFetch(`/v1/posyandu/${id}/balita?${searchParams.toString()}`);
  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('token_expiry');
  }

  if (!response.ok) {
    throw new Error('gagal mengambil balita');
  }

  const data: FetchBalitaResponse = await response.json();

  return data;
}

export async function getBumil(id: number, params?: Get3BParams) {
  const searchParams = new URLSearchParams();

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.set(key, String(value));
    }
  });

  const response = await apiFetch(`/v1/posyandu/${id}/bumil?${searchParams.toString()}`);
  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('token_expiry');
  }

  if (!response.ok) {
    throw new Error('gagal mengambil bumil');
  }

  const data: FetchBumilResponse = await response.json();

  return data;
}

export async function getBusui(id: number, params?: Get3BParams) {
  const searchParams = new URLSearchParams();

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.set(key, String(value));
    }
  });

  const response = await apiFetch(`/v1/posyandu/${id}/busui?${searchParams.toString()}`);
  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('token_expiry');
  }

  if (!response.ok) {
    throw new Error('gagal mengambil busui');
  }

  const data: FetchBusuiResponse = await response.json();

  return data;
}

export async function postBalita(posyandu_id: number, input: BalitaInput) {
  const response = await apiFetch(`/v1/posyandu/${posyandu_id}/balita`, {
    method: 'POST',
    body: JSON.stringify(input)
  });

  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('token_expiry');
  }
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(data?.message || data?.error || 'Create balita gagal', response.status, data);
  }

  return data as PostBalitaResponse;
}

export async function postBumil(posyandu_id: number, input: BumilInput) {
  const response = await apiFetch(`/v1/posyandu/${posyandu_id}/bumil`, {
    method: 'POST',
    body: JSON.stringify(input)
  });

  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('token_expiry');
  }
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(data?.message || data?.error || 'Create bumil gagal', response.status, data);
  }

  return data as PostBumilResponse;
}

export async function postBusui(posyandu_id: number, input: BusuiInput) {
  const response = await apiFetch(`/v1/posyandu/${posyandu_id}/busui`, {
    method: 'POST',
    body: JSON.stringify(input)
  });

  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('token_expiry');
  }
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(data?.message || data?.error || 'Create busui gagal', response.status, data);
  }

  return data as PostBusuiResponse;
}

export async function getIbu(id: number, params?: Get3BParams) {
  const searchParams = new URLSearchParams();

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.set(key, String(value));
    }
  });

  const response = await apiFetch(`/v1/posyandu/${id}/ibu?${searchParams.toString()}`);
  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('token_expiry');
  }

  if (!response.ok) {
    throw new Error('gagal mengambil ibu');
  }

  const data: FetchPendudukResponse = await response.json();

  return data;
}
