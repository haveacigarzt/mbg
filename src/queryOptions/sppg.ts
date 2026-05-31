import { queryOptions } from "@tanstack/react-query";
import { getSPPG, getSPPGByID } from "../api/sppg";
import type { GetSPPGParams } from "../types/sppg";

export function getSPPGQueryOptions(params?: GetSPPGParams) {
  return queryOptions({
    queryKey: ["sppg", params],
    queryFn: () => getSPPG(params),
  });
}

export function getSPPGByIDQueryOptions(id: number) {
  return queryOptions({
    queryKey: [`sppg-${id}`],
    queryFn: () => getSPPGByID(id),
  });
}
