import type {
  CreatePengirimanInput,
  FetchPengirimanResponse,
  GetPengirimanParams,
} from "../types/pengiriman";
import { apiFetch } from "./client";

export async function postPengiriman(input: CreatePengirimanInput) {
  const response = await apiFetch("/v1/pengiriman", {
    method: "POST",
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error("gagal membuat pengiriman");
  }

  return response.json();
}

export async function getPengiriman(params?: GetPengirimanParams) {
  const searchParams = new URLSearchParams();

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.set(key, String(value));
    }
  });

  const response = await apiFetch(`/v1/pengiriman?${searchParams.toString()}`, {
    headers: {
      Authorization: `Bearer WG5IBGQCPCGWISHG3DXHS7LVTA`,
    },
  });

  if (!response.ok) {
    throw new Error("gagal mengambil pengiriman");
  }

  const data: FetchPengirimanResponse = await response.json();

  return data;
}
