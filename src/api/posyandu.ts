import { apiFetch } from "./client";
import type {
  FetchPosyanduResponse,
  GetPosyanduParams,
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
