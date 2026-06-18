import type {
  CreateTrackingInput,
  FetchTrackingResponse,
} from "@/types/tracking";
import { ApiError, apiFetch } from "./client";

export async function postTracking(input: CreateTrackingInput) {
  const response = await apiFetch(
    `/v1/pengiriman/${input.pengiriman_id}/tracking`,
    {
      method: "POST",
      body: JSON.stringify({
        latitude: input.latitude,
        longitude: input.longitude,
        speed: input.speed,
        accuracy: input.accuracy,
      }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(
      data?.message || data?.error || "Create tracking gagal",
      response.status,
      data,
    );
  }

  return data;
}

export async function getTracking(pengiriman_ids: number[]) {
  // console.log(`/v1/tracking?pengiriman_ids=${pengiriman_ids.join(",")}`);
  const response = await apiFetch(
    `/v1/tracking?pengiriman_ids=${pengiriman_ids.join(",")}`,
  );

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(
      data?.message || data?.error || "Get tracking gagal",
      response.status,
      data,
    );
  }

  // console.log("init tracking", data);

  return data as FetchTrackingResponse;
}
