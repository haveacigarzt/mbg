import { apiFetch } from "./client";
import type { FetchSekolahResponse, GetSekolahParams } from "../types/sekolah";

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
