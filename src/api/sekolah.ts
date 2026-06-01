import { apiFetch } from "./client";
import type {
  FetchSekolahResponse,
  GetSekolahParams,
  PostSekolah,
} from "../types/sekolah";

export async function getSekolah(params?: GetSekolahParams) {
  const searchParams = new URLSearchParams();

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.set(key, String(value));
    }
  });

  const response = await apiFetch(`/v1/sekolah?${searchParams.toString()}`);

  if (!response.ok) {
    throw new Error("gagal mengambil sekolah");
  }

  const data: FetchSekolahResponse = await response.json();

  return data;
}

export async function updateSekolah(sekolah_id: number, input: PostSekolah) {
  const response = await apiFetch(`/v1/sekolah/${sekolah_id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error("gagal update sekolah");
  }

  const data: FetchSekolahResponse = await response.json();

  return data.sekolah;
}

export async function deleteSekolah(sekolah_id: number) {
  const response = await apiFetch(`/v1/sekolah/${sekolah_id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("gagal menghapus sekolah");
  }

  const data: FetchSekolahResponse = await response.json();

  return data.sekolah;
}
