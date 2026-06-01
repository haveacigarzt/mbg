import type { Metadata } from "./metadata";

export type SPPG = {
  id: number;
  created_at: string;
  user_id: number;
  nama: string;
  alamat: string;
  sosmed_url: string[];
  kepala_sppg: string;
  nomor_telepon: string;
  email: string;
  latitude: number;
  longitude: number;
  kecamatan: string;
  kelurahan: string;
  kecamatan_id: number;
  kelurahan_id: number;
  kapasitas_porsi: number;
  status_aktif: boolean;
  version: number;
};

export type FetchSPPGResponse = {
  metadata: Metadata;
  sppg: SPPG[];
};

export type FetchSingleSPPGResponse = {
  sppg: SPPG;
};

export type Distrik = {
  id: number;
  name: string;
};

export type FetchKecamatanResponse = {
  kecamatan: Distrik[];
};

export type FetchKelurahanResponse = {
  kelurahan: Distrik[];
};

export type GetSPPGParams = {
  id?: number;
};

export type PostSPPG = {
  nama: string;
  alamat: string;
  sosmed_url: string[];
  kepala_sppg: string;
  nomor_telepon: string;
  email: string;
  latitude: number;
  longitude: number;
  kecamatan_id: number;
  kelurahan_id: number;
  kapasitas_porsi: number;
  status_aktif: boolean;
};
