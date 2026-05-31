import { queryOptions } from "@tanstack/react-query";
import { getPosyandu } from "../api/posyandu";
import type { GetPosyanduParams } from "../types/posyandu";

export function getPosyanduQueryOptions(params?: GetPosyanduParams) {
  return queryOptions({
    queryKey: ["posyandu", params],
    queryFn: () => getPosyandu(params),
  });
}
