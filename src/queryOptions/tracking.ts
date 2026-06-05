import { postTracking } from "@/api/tracking";
import type { CreateTrackingInput } from "@/types/tracking";
import { mutationOptions } from "@tanstack/react-query";

export function createTrackingMutationOptions() {
  return mutationOptions({
    mutationFn: ({ input }: { input: CreateTrackingInput }) =>
      postTracking(input),
  });
}
