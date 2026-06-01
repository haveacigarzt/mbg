import { mutationOptions, queryOptions } from "@tanstack/react-query";
import {
  createSekolah,
  deleteSekolah,
  getSekolah,
  updateSekolah,
} from "../api/sekolah";
import type { GetSekolahParams, PostSekolah } from "../types/sekolah";

export function getSekolahQueryOptions(params?: GetSekolahParams) {
  return queryOptions({
    queryKey: ["sekolah", params],
    queryFn: () => getSekolah(params),
  });
}

export function updateSekolahMutationOptions() {
  return mutationOptions({
    mutationFn: ({
      sekolah_id,
      input,
    }: {
      sekolah_id: number;
      input: PostSekolah;
    }) => updateSekolah(sekolah_id, input),
  });
}

export function createSekolahMutationOptions() {
  return mutationOptions({
    mutationFn: ({ input }: { input: PostSekolah }) => createSekolah(input),
  });
}

export function deleteSekolahMutationOptions() {
  return mutationOptions({
    mutationFn: (sekolah_id: number) => deleteSekolah(sekolah_id),
  });
}
