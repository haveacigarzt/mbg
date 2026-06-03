import type {
  CreatePengirimanInput,
  FetchPengirimanResponse,
  GetPengirimanParams,
} from "../types/pengiriman";
import { ApiError, apiFetch } from "./client";

export async function postPengiriman(input: CreatePengirimanInput) {
  const response = await apiFetch("/v1/pengiriman", {
    method: "POST",
    body: JSON.stringify(input),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(
      data?.message || data?.error || "Create pengiriman gagal",
      response.status,
      data,
    );
  }

  return data;
}

export async function getPengiriman(params?: GetPengirimanParams) {
  const searchParams = new URLSearchParams();

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.set(key, String(value));
    }
  });

  const response = await apiFetch(`/v1/pengiriman?${searchParams.toString()}`);

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(
      data?.message || data?.error || "Get pengiriman gagal",
      response.status,
      data,
    );
  }

  return data as FetchPengirimanResponse;
}
