import type { Metadata } from "./metadata";

export type Drivers = {
  id: number;
  nama: string;
  nomor_telepon: string;
  status_aktif: boolean;
  sppg_id: number;
  version: number;
};

export type FetchDriversResponse = {
  metadata: Metadata;
  drivers: Drivers[];
};

export type FetchDriverResponse = {
  driver: {
    id: number;
    nama: string;
    nomor_telepon: string;
    status_aktif: boolean;
    sppg: {
      id: number;
      created_at: string;
      alamat: string;
      nama: string;
    };
    version: number;
  };
};

export type GetDriversParams = {
  status_aktif?: boolean;
  sppg_id?: number;
  page?: number;
  page_size?: number;
  sort?: string;
  nama?: string;
};

export type PostDriver = {
  nama: string;
  no_telepon: string;
  email: string;
  password: string;
};

export type PatchDriver = {
  nama: string;
  nomor_telepon: string;
  status_aktif: boolean;
};
