import type {
  FetchDriversResponse,
  GetDriversParams,
  PatchDriver,
  PostDriver,
} from "../types/drivers";
import { ApiError, apiFetch } from "./client";

export async function getDrivers(params?: GetDriversParams) {
  const searchParams = new URLSearchParams();

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.set(key, String(value));
    }
  });

  const response = await apiFetch(`/v1/drivers?${searchParams.toString()}`);

  if (!response.ok) {
    throw new Error("gagal mengambil drivers");
  }

  const data: FetchDriversResponse = await response.json();

  return data;
}

export async function createDriver(input: PostDriver) {
  const payload = {
    nama: input.nama,
    nomor_telepon: input.no_telepon,
    user: {
      name: input.nama,
      email: input.email,
      password: input.password,
    },
  };
  console.log(payload);
  const response = await apiFetch(`/v1/drivers`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(
      data?.message || data?.error || "Login gagal",
      response.status,
      data,
    );
  }

  return data.drivers as FetchDriversResponse;
}

export async function updateDriver(input: PatchDriver, id: number) {
  const response = await apiFetch(`/v1/drivers/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(
      data?.message || data?.error || "Gagal patch /drivers",
      response.status,
      data,
    );
  }

  return data.drivers as FetchDriversResponse;
}
