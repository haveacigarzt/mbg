import { getTracking, postTracking } from "@/api/tracking";
import type { CreateTrackingInput } from "@/types/tracking";
import { mutationOptions, queryOptions } from "@tanstack/react-query";

export function createTrackingMutationOptions() {
  return mutationOptions({
    mutationFn: ({ input }: { input: CreateTrackingInput }) =>
      postTracking(input),
  });
}

export function getTrackingQueryOptions(pengiriman_ids: number[]) {
  return queryOptions({
    queryKey: ["tracking"],
    queryFn: () => getTracking(pengiriman_ids),
    enabled: pengiriman_ids.length > 0,
  });
}
