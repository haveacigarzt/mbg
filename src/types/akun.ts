import type { Metadata } from './metadata';

export type Akun = {
  id: number;
  jenis: string;
  name: string;
  email: string;
  instansi: string;
  activated: boolean;
  terakhir_aktif: string;
};

export type FetchAkunResponse = {
  akun: Akun[];
  metadata: Metadata;
};

export type FetchUsersSummaryResponse = {
  summary: {
    total: number;
    sppg: number;
    stakeholder: number;
    nonaktif: number;
  };
};

export type GetAkunParams = {
  status?: string;
  name?: string;
  role_id?: number;
  page?: number;
  page_size?: number;
  sort?: string;
};

export type PostAkunInput = {
  role_id: number;
  name: string;
  email: string;
  password: string;
};
