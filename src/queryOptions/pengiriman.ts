import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { getPengiriman, postPengiriman } from "../api/pengiriman";
import type {
  CreatePengirimanInput,
  GetPengirimanParams,
} from "../types/pengiriman";

export function getPengirimanQueryOptions(params?: GetPengirimanParams) {
  return queryOptions({
    queryKey: ["pengiriman", params],
    queryFn: () => getPengiriman(params),
  });
}

export function createPengirimanMutationOptions() {
  return mutationOptions({
    mutationFn: ({ input }: { input: CreatePengirimanInput }) =>
      postPengiriman(input),
  });
}
