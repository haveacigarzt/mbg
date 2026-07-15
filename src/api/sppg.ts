import { ApiError, apiFetch } from './client';
import type {
  CreateAlokasiHarianInput,
  CreatePengeluaranHarianInput,
  CreateProduksiHarianInput,
  FetchAlokasiHarianResponse,
  FetchKecamatanResponse,
  FetchKelengkapanResponse,
  FetchKelurahanResponse,
  FetchKeuanganHarianResponse,
  FetchPengeluaranHarianResponse,
  FetchProduksiHarianAllResponse,
  FetchProduksiHarianResponse,
  FetchSinglePengeluaranHarianResponse,
  FetchSingleSPPGResponse,
  FetchSPPGResponse,
  GetSPPGParams,
  PostSPPG
} from '../types/sppg';
import type { CreateSPPGByInvitationRequest } from '@/types/sppg_invitations';
import type { CreatePedagangLokalInput } from '@/types/pedaganglokal';

export async function getSPPG(params?: GetSPPGParams) {
  const searchParams = new URLSearchParams();

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.set(key, String(value));
    }
  });

  const response = await apiFetch(`/v1/sppg?${searchParams.toString()}`);

  if (!response.ok) {
    throw new Error('gagal mengambil sppg');
  }

  const data: FetchSPPGResponse = await response.json();

  return data;
}

export async function getSPPGByID(id: number) {
  const response = await apiFetch(`/v1/sppg/${id}`);

  if (!response.ok) {
    throw new Error('gagal mengambil sppg');
  }

  const data: FetchSingleSPPGResponse = await response.json();

  return data.sppg;
}

export async function getKecamatan() {
  const response = await apiFetch(`/v1/kecamatan`);

  if (!response.ok) {
    throw new Error('gagal mengambil kecamatan');
  }

  const data: FetchKecamatanResponse = await response.json();

  return data.kecamatan;
}

export async function getKelurahan(kecamatan_id: number) {
  if (kecamatan_id == 0) {
    return [];
  }
  const response = await apiFetch(`/v1/kelurahan/${kecamatan_id}`);

  if (!response.ok) {
    throw new Error('gagal mengambil kelurahan');
  }

  const data: FetchKelurahanResponse = await response.json();

  return data.kelurahan;
}

export async function updateSPPG(sppg_id: number, input: PostSPPG) {
  const response = await apiFetch(`/v1/sppg/${sppg_id}`, {
    method: 'PATCH',
    body: JSON.stringify(input)
  });

  if (!response.ok) {
    throw new Error('gagal update sppg');
  }

  const data: FetchSPPGResponse = await response.json();

  return data.sppg;
}

// 20/06/2026
export async function getAlokasiHarian(sppg_id: number, tanggal: string) {
  const response = await apiFetch(`/v1/sppg/${sppg_id}/alokasiharian?tanggal=${tanggal}`);
  if (!response.ok) {
    throw new Error('gagal mengambil alokasi harian');
  }
  const data: FetchAlokasiHarianResponse = await response.json();
  return data.alokasi_harian;
}
export async function getPengeluaranHarian(sppg_id: number, tanggal: string) {
  const response = await apiFetch(`/v1/sppg/${sppg_id}/pengeluaranharian?tanggal=${tanggal}`);
  if (!response.ok) {
    throw new Error('gagal mengambil pengeluaran harian');
  }
  const data: FetchPengeluaranHarianResponse = await response.json();
  return data;
}
export async function postPengeluaran(sppg_id: number, input: CreatePengeluaranHarianInput) {
  if (input.alokasi_harian_id === 0) {
    throw new Error('gagal menambahkan pengeluaran harian');
  }
  const response = await apiFetch(`/v1/sppg/${sppg_id}/pengeluaranharian`, {
    method: 'POST',
    body: JSON.stringify(input)
  });
  if (!response.ok) {
    throw new Error('gagal menambahkan pengeluaran harian');
  }
  const data: FetchSinglePengeluaranHarianResponse = await response.json();
  return data.pengeluaran_harian;
}
export async function postAlokasi(sppg_id: number, input: CreateAlokasiHarianInput) {
  const response = await apiFetch(`/v1/sppg/${sppg_id}/alokasiharian`, {
    method: 'POST',
    body: JSON.stringify(input)
  });
  if (!response.ok) {
    throw new Error('gagal menambahkan alokasi harian');
  }
  const data: FetchAlokasiHarianResponse = await response.json();
  return data.alokasi_harian;
}
export async function deletePengeluaran(sppg_id: number, id: number) {
  const response = await apiFetch(`/v1/sppg/${sppg_id}/pengeluaranharian/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    throw new Error('gagal menghapus pengeluaran harian');
  }
  const data: { message: string } = await response.json();
  return data.message;
}
export async function getProduksiHarian(sppg_id: number, tanggal: string) {
  const response = await apiFetch(`/v1/sppg/${sppg_id}/produksiharian?tanggal=${tanggal}`);
  if (!response.ok) {
    throw new Error('gagal mengambil produksi harian');
  }
  const data: FetchProduksiHarianResponse = await response.json();
  return data.produksi_harian;
}
export async function getProduksiHarianAll(tanggal: string) {
  const response = await apiFetch(`/v1/produksiharian?tanggal=${tanggal}`);
  if (!response.ok) {
    throw new Error('gagal mengambil produksi harian all');
  }
  const data: FetchProduksiHarianAllResponse = await response.json();
  return data.produksi_harian;
}
export async function postProduksiHarian(sppg_id: number, input: CreateProduksiHarianInput) {
  const response = await apiFetch(`/v1/sppg/${sppg_id}/produksiharian`, {
    method: 'POST',
    body: JSON.stringify(input)
  });
  if (!response.ok) {
    throw new Error('gagal menambahkan produksi harian');
  }
  const data: FetchProduksiHarianResponse = await response.json();
  return data.produksi_harian;
}

// 21/06/2026
export async function getKeuanganHarian(tanggal: string) {
  const response = await apiFetch(`/v1/keuanganharian?tanggal=${tanggal}`);
  if (!response.ok) {
    throw new Error('gagal mengambil list keuangan harian');
  }
  const data: FetchKeuanganHarianResponse = await response.json();
  return data.keuangan_harian;
}

// 26/06/2026
export async function createSPPGByInvitation(input: CreateSPPGByInvitationRequest, token: string) {
  const response = await apiFetch(`/v1/register/${token}`, {
    method: 'POST',
    body: JSON.stringify(input)
  });
  const data = await response.json();
  if (!response.ok) {
    throw new ApiError(data?.message || data?.error || 'Create sppg gagal', response.status, data);
  }
  // return data.keuangan_harian;
}
export async function deleteSPPGInvitation(token: string) {
  const response = await apiFetch(`/v1/invitation/${token}`, {
    method: 'DELETE'
  });
  const data = await response.json();
  if (!response.ok) {
    throw new ApiError(data?.message || data?.error || 'Delete sppg invitasi gagal', response.status, data);
  }
  // return data.keuangan_harian;
}
export async function postPedagangLokal(sppg_id: number, input: CreatePedagangLokalInput) {
  if (sppg_id === 0) {
    throw new Error('gagal menambahkan pedagang lokal');
  }
  const response = await apiFetch(`/v1/pedaganglokal`, {
    method: 'POST',
    body: JSON.stringify(input)
  });
  if (!response.ok) {
    throw new Error('gagal menambahkan pedagang lokal');
  }
  const data: { message: string } = await response.json();
  return data.message;
}
export async function updatePedagangLokal(sppg_id: number, input: CreatePedagangLokalInput, id: number) {
  if (sppg_id === 0 || id === 0) {
    throw new Error('gagal mengubah pedagang lokal');
  }
  const response = await apiFetch(`/v1/pedaganglokal/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input)
  });
  if (!response.ok) {
    throw new Error('gagal mengubah pedagang lokal');
  }
  const data: { message: string } = await response.json();
  return data.message;
}
export async function deletePedagangLokal(id: number) {
  if (id === 0) {
    throw new Error('gagal menghapus pedagang lokal');
  }
  const response = await apiFetch(`/v1/pedaganglokal/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    throw new Error('gagal menghapus pedagang lokal');
  }
  const data: { message: string } = await response.json();
  return data.message;
}
export async function getKelengkapan(tanggal: string) {
  const response = await apiFetch(`/v1/sppg2/kelengkapandata?tanggal=${tanggal}`);
  if (!response.ok) {
    throw new Error('gagal mengambil kelengkapan data');
  }
  const data: FetchKelengkapanResponse = await response.json();
  return data.kelengkapan_data;
}
