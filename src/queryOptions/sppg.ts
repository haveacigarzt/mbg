import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { getKecamatan, getKelurahan, getSPPG, getSPPGByID, updateSPPG } from "../api/sppg";
import type { GetSPPGParams, PostSPPG } from "../types/sppg";
import mockDataSppg from "../mocks/sppg.json";

export function getSPPGQueryOptions(params?: GetSPPGParams) {
  return queryOptions({
    queryKey: ["sppg", params],
    // queryFn: async () => {
    //   await new Promise((resolve) => setTimeout(resolve, 800));
    //   return mockDataSppg;
    // },

    // UNCOMMENT KLO DIRUMAH
    queryFn: () => getSPPG(params),
  });
}

export function getSPPGByIDQueryOptions(id: number) {
  return queryOptions({
    queryKey: ["sppg", id],

    // --- VERSI MOCKING WFC ---
    // queryFn: async () => {
    //   await new Promise((resolve) => setTimeout(resolve, 300));
    //   const found = mockDataSppg.sppg.find((el) => el.id === id);
    //   if (!found) throw new Error(`SPPG dengan id ${id} tidak ditemukan`);
    //   return found;
    // },

    // UNCOMMENT KLO DIRUMAH
    queryFn: () => getSPPGByID(id),
  });
}

export function getKecamatanQueryOptions() {
  return queryOptions({
    queryKey: ["kecamatan"],

    // --- VERSI MOCKING WFC ---
    // queryFn: async () => {
    //   await new Promise((resolve) => setTimeout(resolve, 300));
    //   // return array langsung, bukan object
    //   return [{ id: 1, nama: "Kapuas" }];
    // },

    // UNCOMMENT KLO DIRUMAH
    queryFn: () => getKecamatan(),
  });
}

export function getKelurahanQueryOptions(kecamatan_id: number) {
  return queryOptions({
    queryKey: ["kelurahan", kecamatan_id],

    // --- VERSI MOCKING WFC ---
    // queryFn: async () => {
    //   await new Promise((resolve) => setTimeout(resolve, 300));
    //   return [
    //     { id: 1, nama: "Bunut", kecamatan_id: 1 },
    //     { id: 2, nama: "Ilir Kota", kecamatan_id: 1 },
    //   ];
    // },

    // UNCOMMENT KLO DIRUMAH
    queryFn: () => getKelurahan(kecamatan_id),
  });
}

export function updateSPPGMutationOptions() {
  return mutationOptions({
    mutationFn: ({ sppg_id, input }: { sppg_id: number; input: PostSPPG }) => updateSPPG(sppg_id, input),
  });
}
