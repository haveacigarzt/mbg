import type {
  CreatePengirimanInput,
  FetchPengirimanResponse,
  GetPengirimanParams,
  Pengiriman,
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

export async function antarPengiriman(id: number) {
  const response = await apiFetch(`/v1/pengiriman/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status: "berangkat" }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(
      data?.message || data?.error || "Update pengiriman gagal",
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

export async function getPengirimanAktifByDriverID() {
  const response = await apiFetch("/v1/pengiriman-aktif/driver");

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(
      data?.message || data?.error || "Get pengiriman gagal",
      response.status,
      data,
    );
  }

  return data.pengiriman as Pengiriman;
}
