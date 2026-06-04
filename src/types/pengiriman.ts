import type { Metadata } from "./metadata";

// export type  = {
//   tujuan_type: string;
//   tujuan_id: number;
// };

export type Pengiriman = {
  id: number;
  created_at: string;
  tujuan_type: "sekolah" | "posyandu";
  tujuan_id: number;
  tujuan_nama: string;
  driver_id: number | null;
  driver_nama: string | null;
  status: "menunggu" | "berangkat" | "sampai" | "dibatalkan";
  waktu_berangkat: string | null;
  waktu_selesai: string | null;
  sppg_id: number;
  version: number;
};

export type CreatePengirimanInput = {
  tujuan: { tujuan_type: string; tujuan_id: number }[];
};

export type FetchPengirimanResponse = {
  metadata: Metadata;
  pengiriman: Pengiriman[];
};

export type FetchSinglePengirimanResponse = {
  pengiriman: Pengiriman;
};

export type GetPengirimanParams = {
  status?: string;
  sppg_id?: number;
  tujuan_type?: string;
  page?: number;
  page_size?: number;
  sort?: string;
  tanggal?: string;
};
