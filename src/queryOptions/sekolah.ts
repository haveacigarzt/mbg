import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { createSekolah, deleteSekolah, getSekolah, updateSekolah } from "../api/sekolah";
import type { GetSekolahParams, PostSekolah } from "../types/sekolah";
import mockDataSekolah from "../mocks/sekolah.json";

export function getSekolahQueryOptions(params?: GetSekolahParams) {
  return queryOptions({
    queryKey: ["sekolah", params],
    // queryFn: async () => {
    //   await new Promise((resolve) => setTimeout(resolve, 800));
    //   return mockDataSekolah;
    // },

    // QUERY FN KALAU SERVER HIDUP PLEASE UNCOMMENT KLO DIRUMAH
    queryFn: () => getSekolah(params),
  });
}

export function updateSekolahMutationOptions() {
  return mutationOptions({
    // mutationFn: async ({ sekolah_id, input }: { sekolah_id: number; input: PostSekolah }) => {
    //   await new Promise((resolve) => setTimeout(resolve, 800));
    //   console.log(`[MOCK] Berhasil update sekolah ID ${sekolah_id} dengan data:`, input);
    //   return { status: "success", message: "Data berhasil diperbarui!" };
    // },

    // MUTATE FN UNCOMMENT KLO LAGI DI RUMAH
    mutationFn: ({ sekolah_id, input }: { sekolah_id: number; input: PostSekolah }) => updateSekolah(sekolah_id, input),
  });
}

export function createSekolahMutationOptions() {
  return mutationOptions({
    // mutationFn: async ({ input }: { input: PostSekolah }) => {
    //   await new Promise((resolve) => setTimeout(resolve, 800));
    //   console.log("[MOCK] Berhasil create sekolah dengan data:", input);
    //   return { status: "success", message: "Data berhasil ditambahkan!" };
    // },

    // MUTATE FN UNCOMMENT KLO LAGI DI RUMAH
    mutationFn: ({ input }: { input: PostSekolah }) => createSekolah(input),
  });
}

export function deleteSekolahMutationOptions() {
  return mutationOptions({
    // mutationFn: async (sekolah_id: number) => {
    //   await new Promise((resolve) => setTimeout(resolve, 800));
    //   console.log(`[MOCK] Berhasil delete sekolah ID ${sekolah_id}`);
    //   return { status: "success", message: `Data sekolah berhasil dihapus!` };
    // },
    // MUTATE FN UNCOMMENT KLO LAGI DI RUMAH
    mutationFn: (sekolah_id: number) => deleteSekolah(sekolah_id),
  });
}
