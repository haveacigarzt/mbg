import { apiFetch } from "./client";
import type {
  FetchPosyanduResponse,
  GetPosyanduParams,
  PostPosyandu,
} from "../types/posyandu";

export async function getPosyandu(params?: GetPosyanduParams) {
  const searchParams = new URLSearchParams();

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.set(key, String(value));
    }
  });

  const response = await apiFetch(`/v1/posyandu?${searchParams.toString()}`);

  if (!response.ok) {
    throw new Error("gagal mengambil posyandu");
  }

  const data: FetchPosyanduResponse = await response.json();

  return data;
}

export async function createPosyandu(input: PostPosyandu) {
  const response = await apiFetch(`/v1/posyandu`, {
    method: "POST",
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error("gagal create posyandu");
  }

  const data: FetchPosyanduResponse = await response.json();

  return data.posyandu;
}

export async function updatePosyandu(posyandu_id: number, input: PostPosyandu) {
  const response = await apiFetch(`/v1/posyandu/${posyandu_id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error("gagal update posyandu");
  }

  const data: FetchPosyanduResponse = await response.json();

  return data.posyandu;
}

export async function deletePosyandu(posyandu_id: number) {
  const response = await apiFetch(`/v1/posyandu/${posyandu_id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("gagal menghapus posyandu");
  }

  const data: FetchPosyanduResponse = await response.json();

  return data.posyandu;
}
