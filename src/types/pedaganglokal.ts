import type { Metadata } from './metadata';

export interface GetPedagangLokalParams {
  sppg?: string;
  page?: number;
  page_size?: number;
  sort?: string;
  nama?: string;
}

export interface PedagangLokalType {
  id: number;
  nama: string;
  alamat: string;
  no_hp: string;
  longitude: number;
  latitude: number;
  jenis_produk: string;
  sppg_id: number;
  created_at: string;
  updated_at: string;
  version: number;
}

export interface FetchPedagangLokalResponse {
  metadata: Metadata;
  pedagang_lokal: PedagangLokalType[];
}
