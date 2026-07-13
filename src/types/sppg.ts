import type { Metadata } from './metadata';

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

// 20/06/2026
export type FetchAlokasiHarianResponse = {
  alokasi_harian: {
    id: number;
    created_at: string;
    updated_at: string;
    sppg_id: number;
    jumlah: number;
    tanggal: string;
  };
};
export type FetchPengeluaranHarianResponse = {
  metadata: Metadata;
  pengeluaran_harian: [
    {
      id: number;
      created_at: string;
      updated_at: string;
      alokasi_harian_id: number;
      produk: string;
      jumlah: number;
      satuan: string;
      harga_satuan: number;
      subtotal: number;
      pedagang_lokal_id: number;
      nama_pedagang_lokal: string;
      nama_pedagang_non_lokal: string;
    }
  ];
};
export type FetchSinglePengeluaranHarianResponse = {
  pengeluaran_harian: {
    id: number;
    created_at: string;
    updated_at: string;
    alokasi_harian_id: number;
    produk: string;
    jumlah: number;
    satuan: string;
    harga_satuan: number;
    subtotal: number;
  };
};
export type CreatePengeluaranHarianInput = {
  alokasi_harian_id: number;
  produk: string;
  jumlah: number;
  satuan: string;
  harga_satuan: number;
};
export type CreateAlokasiHarianInput = {
  tanggal: string;
  jumlah: number;
};
export type CreateProduksiHarianInput = {
  tanggal: string;
  waktu_mulai: string;
  estimasi_waktu_selesai: string;
};
export type FetchProduksiHarianResponse = {
  produksi_harian: {
    id: number;
    created_at: string;
    updated_at: string;
    sppg_id: number;
    waktu_mulai: string;
    estimasi_waktu_selesai: string;
    tanggal: string;
  };
};
export type FetchProduksiHarianAllResponse = {
  produksi_harian: [
    {
      id: number;
      row_id: number;
      created_at: string;
      updated_at: string;
      sppg_id: number;
      waktu_mulai: string;
      estimasi_waktu_selesai: string;
      tanggal: string;
    }
  ];
};
export type FetchKeuanganHarianResponse = {
  keuangan_harian: [
    {
      row_id: number;
      sppg_id: number;
      sppg_nama: string;
      tanggal: string;
      alokasi: number;
      terpakai: number;
      sisa: number;
    }
  ];
};
