import type { Metadata } from './metadata';

export type Sekolah = {
  id: number;
  nama: string;
  alamat: string;
  tingkat: 'SD' | 'SMP' | 'SMA';
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
  tingkat: 'SD' | 'SMP' | 'SMA';
  latitude: number;
  longitude: number;
  kecamatan_id: number;
  kelurahan_id: number;
  jumlah_siswa: number;
};

export type GetPesertaDidikParams = {
  page?: number;
  page_size?: number;
  sort?: string;
  nama?: string;
};

export type PesertaDidik = {
  penduduk: {
    alamat: string;
    id: number;
    jenis_kelamin: 'L' | 'P';
    kelurahan_id: number;
    kelurahan_nama: string;
    nama: string;
    nik: number;
    no_hp: string;
    tanggal_lahir: string; // YYYY-MM-DD
  };
  peserta_didik: {
    kelas: string;
    nisn: string;
    rombel: string;
    sekolah_id: number;
    sekolah_nama: string;
    status_aktif: boolean;
  };
};

export type FetchPesertaDidikResponse = {
  metadata: Metadata;
  peserta_didik: PesertaDidik[];
};

export type PostPesertaDidikResponse = {
  peserta_didik: {
    penduduk_id: number;
    sekolah_id: number;
    nisn: string;
    kelas: string;
    rombel: string;
    status_aktif: boolean;
  };
};

export type PesertaDidikInput = {
  penduduk: {
    nik: string;
    nama: string;
    jenis_kelamin: 'L' | 'P';
    tanggal_lahir: string; // YYYY-MM-DD
    kelurahan_id: number;
    alamat: string;
    no_hp: string;
  };
  peserta_didik: {
    nisn: string;
    kelas: string;
    rombel: string;
  };
};
