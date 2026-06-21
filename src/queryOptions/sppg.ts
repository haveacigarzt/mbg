import { mutationOptions, queryOptions } from '@tanstack/react-query';
import {
  deletePengeluaran,
  getAlokasiHarian,
  getKecamatan,
  getKelurahan,
  getKeuanganHarian,
  getPengeluaranHarian,
  getProduksiHarian,
  getProduksiHarianAll,
  getSPPG,
  getSPPGByID,
  postAlokasi,
  postPengeluaran,
  postProduksiHarian,
  updateSPPG
} from '../api/sppg';
import type { CreateAlokasiHarianInput, CreatePengeluaranHarianInput, CreateProduksiHarianInput, GetSPPGParams, PostSPPG } from '../types/sppg';
import mockDataSppg from '../mocks/sppg.json';

export function getSPPGQueryOptions(params?: GetSPPGParams) {
  return queryOptions({
    queryKey: ['sppg', params],
    // queryFn: async () => {
    //   await new Promise((resolve) => setTimeout(resolve, 800));
    //   return mockDataSppg;
    // },

    // UNCOMMENT KLO DIRUMAH
    queryFn: () => getSPPG(params)
  });
}

export function getSPPGByIDQueryOptions(id: number) {
  return queryOptions({
    queryKey: ['sppg', id],

    // --- VERSI MOCKING WFC ---
    // queryFn: async () => {
    //   await new Promise((resolve) => setTimeout(resolve, 300));
    //   const found = mockDataSppg.sppg.find((el) => el.id === id);
    //   if (!found) throw new Error(`SPPG dengan id ${id} tidak ditemukan`);
    //   return found;
    // },

    // UNCOMMENT KLO DIRUMAH
    queryFn: () => getSPPGByID(id)
  });
}

export function getKecamatanQueryOptions() {
  return queryOptions({
    queryKey: ['kecamatan'],

    // --- VERSI MOCKING WFC ---
    // queryFn: async () => {
    //   await new Promise((resolve) => setTimeout(resolve, 300));
    //   // return array langsung, bukan object
    //   return [{ id: 1, nama: "Kapuas" }];
    // },

    // UNCOMMENT KLO DIRUMAH
    queryFn: () => getKecamatan()
  });
}

export function getKelurahanQueryOptions(kecamatan_id: number) {
  return queryOptions({
    queryKey: ['kelurahan', kecamatan_id],

    // --- VERSI MOCKING WFC ---
    // queryFn: async () => {
    //   await new Promise((resolve) => setTimeout(resolve, 300));
    //   return [
    //     { id: 1, nama: "Bunut", kecamatan_id: 1 },
    //     { id: 2, nama: "Ilir Kota", kecamatan_id: 1 },
    //   ];
    // },

    // UNCOMMENT KLO DIRUMAH
    queryFn: () => getKelurahan(kecamatan_id)
  });
}

export function updateSPPGMutationOptions() {
  return mutationOptions({
    mutationFn: ({ sppg_id, input }: { sppg_id: number; input: PostSPPG }) => updateSPPG(sppg_id, input)
  });
}

// 20/06/2026
export function getAlokasiHarianQueryOptions(sppg_id: number, tanggal: string) {
  return queryOptions({
    queryKey: ['alokasi_harian', sppg_id, tanggal],
    queryFn: () => getAlokasiHarian(sppg_id, tanggal)
  });
}
export function getPengeluaranHarianQueryOptions(sppg_id: number, tanggal: string) {
  return queryOptions({
    queryKey: ['pengeluaran_harian', sppg_id, tanggal],
    queryFn: () => getPengeluaranHarian(sppg_id, tanggal)
  });
}
export function createPengeluaranMutationOptions() {
  return mutationOptions({
    mutationFn: ({ sppg_id, input }: { sppg_id: number; input: CreatePengeluaranHarianInput }) => postPengeluaran(sppg_id, input)
  });
}
export function createAlokasiMutationOptions() {
  return mutationOptions({
    mutationFn: ({ sppg_id, input }: { sppg_id: number; input: CreateAlokasiHarianInput }) => postAlokasi(sppg_id, input)
  });
}
export function deletePengeluaranMutationOptions() {
  return mutationOptions({
    mutationFn: ({ sppg_id, id }: { sppg_id: number; id: number }) => deletePengeluaran(sppg_id, id)
  });
}
export function getProduksiHarianQueryOptions(sppg_id: number, tanggal: string) {
  return queryOptions({
    queryKey: ['produksi_harian', sppg_id, tanggal],
    queryFn: () => getProduksiHarian(sppg_id, tanggal)
  });
}
export function createProduksiHarianMutationOptions() {
  return mutationOptions({
    mutationFn: ({ sppg_id, input }: { sppg_id: number; input: CreateProduksiHarianInput }) => postProduksiHarian(sppg_id, input)
  });
}

// 21/06/2026
export function getKeuanganHarianQueryOptions(tanggal: string) {
  return queryOptions({
    queryKey: ['keuangan_harian'],
    queryFn: () => getKeuanganHarian(tanggal)
  });
}
export function getAllProduksiHarianQueryOptions(tanggal: string) {
  return queryOptions({
    queryKey: ['produksi_harian_all', tanggal],
    queryFn: () => getProduksiHarianAll(tanggal)
  });
}
