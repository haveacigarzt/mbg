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

export type GetSPPGParams = {
  id?: number;
};
