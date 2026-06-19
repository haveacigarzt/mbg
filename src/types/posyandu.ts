import type { Metadata } from './metadata';

export interface Posyandu {
  id: number;
  nama: string;
  alamat: string;
  kecamatan: string;
  kelurahan: string;
  kecamatan_id: number;
  kelurahan_id: number;
  jumlah_balita: number;
  jumlah_ibu_hamil: number;
  sppg_id: number;
  latitude: number;
  longitude: number;
  version: number;
}

export type FetchPosyanduResponse = {
  metadata: Metadata;
  posyandu: Posyandu[];
};

export type GetPosyanduParams = {
  sppg_id?: number;
  page?: number;
  page_size?: number;
  nama?: string;
  sort?: string;
};

export type PostPosyandu = {
  nama: string;
  alamat: string;
  latitude: number;
  longitude: number;
  kecamatan_id: number;
  kelurahan_id: number;
  jumlah_balita: number;
  jumlah_ibu_hamil: number;
};
