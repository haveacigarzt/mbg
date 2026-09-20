import type { Balita, Bumil, Busui } from './posyandu';
import type { PD } from './sekolah';

export type FetchPendudukResponse = {
  penduduk: {
    penduduk: {
      id: number;
      nik: string;
      nama: string;
      jenis_kelamin: 'L' | 'P';
      tanggal_lahir: string; // YYYY-MM-DD
      kelurahan_id: number;
      kecamatan_id: number;
      kelurahan_nama: string;
      alamat: string;
      no_hp: string;
      kategori: string;
    };
    peserta_didik?: PD;
    busui?: Busui;
    bumil?: Bumil;
    balita?: Balita;
  };
};
