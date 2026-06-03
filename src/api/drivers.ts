import type {
  FetchDriverResponse,
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

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(
      data?.message || data?.error || "Create driver gagal",
      response.status,
      data,
    );
  }

  return data as FetchDriversResponse;
}

export async function getDriverCurrent() {
  const response = await apiFetch(`/v1/driver/current`);

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(
      data?.message || data?.error || "Create driver gagal",
      response.status,
      data,
    );
  }

  return data as FetchDriverResponse;
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
      data?.message || data?.error || "Create driver gagal",
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

export async function deleteDriver(driver_id: number) {
  const response = await apiFetch(`/v1/drivers/${driver_id}`, {
    method: "DELETE",
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
