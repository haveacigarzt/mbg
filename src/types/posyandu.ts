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

export type Get3BParams = {
  page?: number;
  page_size?: number;
  sort?: string;
  nama?: string;
};

export type FetchBalitaResponse = {
  metadata: Metadata;
  balita: BalitaItem[];
};

export type FetchBumilResponse = {
  metadata: Metadata;
  bumil: BumilItem[];
};

export type FetchBusuiResponse = {
  metadata: Metadata;
  busui: BusuiItem[];
};

export type FetchPendudukResponse = {
  metadata: Metadata;
  penduduk: Penduduk[];
};

export type BalitaItem = {
  penduduk: Penduduk;
  balita: Balita;
};

export type BumilItem = {
  penduduk: Penduduk;
  bumil: Bumil;
};

export type BusuiItem = {
  penduduk: Penduduk;
  busui: Busui;
};

export type Penduduk = {
  id: number;
  nik: number;
  nama: string;
  jenis_kelamin: 'L' | 'P';
  tanggal_lahir: string;
  kelurahan_id: string;
  kelurahan_nama: string;
  alamat: string;
  no_hp: string;
};

export type Balita = {
  ibu_id: number;
  ibu_nama: string;
  anak_ke: number;
  berat_lahir: number;
  panjang_lahir: number;
  posyandu_id: number;
  posyandu_nama: string;
};

export type Bumil = {
  hpht: string;
  hpl: string;
  gravida: number;
  para: number;
  abortus: number;
  posyandu_id: number;
  posyandu_nama: string;
};

export type Busui = {
  tanggal_persalinan: string;
  anak_ke: number;
  asi_eksklusif: boolean;
  posyandu_id: number;
  posyandu_nama: string;
};

//

export type PostBalitaResponse = {
  balita: {
    penduduk_id: number;
    posyandu_id: number;
    ibu_id: number;
    anak_ke: number;
    berat_lahir: number;
    panjang_lahir: number;
  };
};

export type PostBumilResponse = {
  bumil: {
    penduduk_id: number;
    posyandu_id: number;
    hpht: string;
    hpl: string;
    gravida: number;
    para: number;
    abortus: number;
  };
};

export type PostBusuiResponse = {
  bumil: {
    penduduk_id: number;
    posyandu_id: number;
    tanggal_persalinan: string;
    anak_ke: number;
    asi_eksklusif: boolean;
  };
};

export type BalitaInput = {
  penduduk: {
    nik: string;
    nama: string;
    jenis_kelamin: 'L' | 'P';
    tanggal_lahir: string; // YYYY-MM-DD
    kelurahan_id: number;
    alamat: string;
    no_hp: string;
  };
  balita: {
    ibu_id: number;
    anak_ke: number;
    berat_lahir: number;
    panjang_lahir: number;
  };
};

export type BumilInput = {
  penduduk: {
    nik: string;
    nama: string;
    jenis_kelamin: 'L' | 'P';
    tanggal_lahir: string; // YYYY-MM-DD
    kelurahan_id: number;
    alamat: string;
    no_hp: string;
  };
  bumil: {
    hpht: string;
    hpl: string;
    gravida: number;
    para: number;
    abortus: number;
  };
};

export type BusuiInput = {
  penduduk: {
    nik: string;
    nama: string;
    jenis_kelamin: 'L' | 'P';
    tanggal_lahir: string; // YYYY-MM-DD
    kelurahan_id: number;
    alamat: string;
    no_hp: string;
  };
  busui: {
    tanggal_persalinan: string;
    anak_ke: number;
    asi_eksklusif: boolean;
  };
};
