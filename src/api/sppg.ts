import { apiFetch } from "./client";
import type {
  FetchSingleSPPGResponse,
  FetchSPPGResponse,
  GetSPPGParams,
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
  const response = await apiFetch(`/v1/sppg/${id}`, {
    headers: {
      Authorization: `Bearer WG5IBGQCPCGWISHG3DXHS7LVTA`,
    },
  });

  if (!response.ok) {
    throw new Error("gagal mengambil sppg");
  }

  const data: FetchSingleSPPGResponse = await response.json();

  return data.sppg;
}
