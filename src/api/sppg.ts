import { apiFetch } from "./client";
import type {
  FetchKecamatanResponse,
  FetchKelurahanResponse,
  FetchSingleSPPGResponse,
  FetchSPPGResponse,
  GetSPPGParams,
  PostSPPG,
} from "../types/sppg";

export async function getSPPG(params?: GetSPPGParams) {
  const searchParams = new URLSearchParams();

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.set(key, String(value));
    }
  });

  const response = await apiFetch(`/v1/sppg?${searchParams.toString()}`);

  if (!response.ok) {
    throw new Error("gagal mengambil sppg");
  }

  const data: FetchSPPGResponse = await response.json();

  return data;
}

export async function getSPPGByID(id: number) {
  const response = await apiFetch(`/v1/sppg/${id}`);

  if (!response.ok) {
    throw new Error("gagal mengambil sppg");
  }

  const data: FetchSingleSPPGResponse = await response.json();

  return data.sppg;
}

export async function getKecamatan() {
  const response = await apiFetch(`/v1/kecamatan`);

  if (!response.ok) {
    throw new Error("gagal mengambil kecamatan");
  }

  const data: FetchKecamatanResponse = await response.json();

  return data.kecamatan;
}

export async function getKelurahan(kecamatan_id: number) {
  const response = await apiFetch(`/v1/kelurahan/${kecamatan_id}`);

  if (!response.ok) {
    throw new Error("gagal mengambil kelurahan");
  }

  const data: FetchKelurahanResponse = await response.json();

  return data.kelurahan;
}

export async function updateSPPG(sppg_id: number, input: PostSPPG) {
  const response = await apiFetch(`/v1/sppg/${sppg_id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error("gagal update sppg");
  }

  const data: FetchSPPGResponse = await response.json();

  return data.sppg;
}
