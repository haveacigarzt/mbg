import type { Metadata } from "./metadata";

export type Sekolah = {
  id: number;
  nama: string;
  alamat: string;
  tingkat: "SD" | "SMP" | "SMA";
  jumlah_siswa: number;
  kecamatan: string;
  kelurahan: string;
  kecamatan_id: number;
  kelurahan_id: number;
  latitude: number;
  longitude: number;
  sppg_id: number;
  version: number;
};

export type FetchSekolahResponse = {
  metadata: Metadata;
  sekolah: Sekolah[];
};

export type GetSekolahParams = {
  sppg_id?: number;
  page?: number;
  page_size?: number;
  sort?: string;
  nama?: string;
};

export type PostSekolah = {
  nama: string;
  alamat: string;
  tingkat: "SD" | "SMP" | "SMA";
  latitude: number;
  longitude: number;
  kecamatan_id: number;
  kelurahan_id: number;
  jumlah_siswa: number;
  status_aktif: boolean;
};
