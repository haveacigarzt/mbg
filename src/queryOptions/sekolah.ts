import { queryOptions } from "@tanstack/react-query";
import { getSekolah } from "../api/sekolah";
import type { GetSekolahParams } from "../types/sekolah";

export function getSekolahQueryOptions(params?: GetSekolahParams) {
  return queryOptions({
    queryKey: ["sekolah", params],
    queryFn: () => getSekolah(params),
  });
}
