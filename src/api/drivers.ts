import type { FetchDriversResponse, GetDriversParams } from "../types/drivers";
import { apiFetch } from "./client";

export async function getDrivers(params?: GetDriversParams) {
  const searchParams = new URLSearchParams();

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.set(key, String(value));
    }
  });

  const response = await apiFetch(`/v1/drivers?${searchParams.toString()}`, {
    headers: {
      Authorization: `Bearer WG5IBGQCPCGWISHG3DXHS7LVTA`,
    },
  });

  if (!response.ok) {
    throw new Error("gagal mengambil drivers");
  }

  const data: FetchDriversResponse = await response.json();

  return data;
}
