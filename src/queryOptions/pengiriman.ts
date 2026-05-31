import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { getPengiriman, postPengiriman } from "../api/pengiriman";
import type { GetPengirimanParams } from "../types/pengiriman";

export function createPengirimanMutationOptions() {
  return mutationOptions({
    mutationFn: postPengiriman,
  });
}

export function getPengirimanQueryOptions(params?: GetPengirimanParams) {
  return queryOptions({
    queryKey: ["pengiriman", params],
    queryFn: () => getPengiriman(params),
  });
}
