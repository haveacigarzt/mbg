import { mutationOptions, queryOptions } from "@tanstack/react-query";
import {
  getKecamatan,
  getKelurahan,
  getSPPG,
  getSPPGByID,
  updateSPPG,
} from "../api/sppg";
import type { GetSPPGParams, PostSPPG } from "../types/sppg";

export function getSPPGQueryOptions(params?: GetSPPGParams) {
  return queryOptions({
    queryKey: ["sppg", params],
    queryFn: () => getSPPG(params),
  });
}

export function getSPPGByIDQueryOptions(id: number) {
  return queryOptions({
    queryKey: ["sppg", id],
    queryFn: () => getSPPGByID(id),
  });
}

export function getKecamatanQueryOptions() {
  return queryOptions({
    queryKey: ["kecamatan"],
    queryFn: () => getKecamatan(),
  });
}

export function getKelurahanQueryOptions(kecamatan_id: number) {
  return queryOptions({
    queryKey: ["kelurahan", kecamatan_id],
    queryFn: () => getKelurahan(kecamatan_id),
  });
}

export function updateSPPGMutationOptions() {
  return mutationOptions({
    mutationFn: ({ sppg_id, input }: { sppg_id: number; input: PostSPPG }) =>
      updateSPPG(sppg_id, input),
  });
}
