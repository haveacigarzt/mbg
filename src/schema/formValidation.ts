import { z } from "zod";

const socialUrlSchema = z
  .url("URL tidak valid")
  .refine(
    (url) =>
      url.includes("instagram.com") ||
      url.includes("facebook.com") ||
      url.includes("tiktok.com") ||
      url.includes("youtube.com"),
    {
      message:
        "URL harus berasal dari media sosial yang didukung (Instagram, Facebook, TikTok, YouTube)",
    },
  );

export const sppgSchema = z.object({
  nama: z.string().min(1, "Nama wajib diisi"),
  alamat: z.string().min(1, "Alamat wajib diisi"),
  kepala_sppg: z.string().min(1, "Kepala SPPG wajib diisi"),
  nomor_telepon: z.string().min(1, "Nomor telepon wajib diisi"),
  email: z.email("Email tidak valid"),

  kecamatan_id: z.number().positive(),
  kelurahan_id: z.number().positive(),

  kapasitas_porsi: z.number().nonnegative(),
  status_aktif: z.boolean(),

  latitude: z.number(),
  longitude: z.number(),

  sosmed_url: z.preprocess(
    (value) => {
      if (!Array.isArray(value)) return [];

      return value.map((v) => String(v).trim()).filter(Boolean);
    },
    z.array(socialUrlSchema).max(3, "Maksimal 3 URL"),
  ),
});

export const sekolahSchema = z.object({
  nama: z.string().min(1, "Nama wajib diisi"),
  alamat: z.string().min(1, "Alamat wajib diisi"),
  tingkat: z.enum(["SD", "SMP", "SMA"], "Tingkat harus SD, SMP, atau SMA"),
  kelurahan_id: z.number().min(1, "Kelurahan wajib diisi"),
  kecamatan_id: z.number().min(1, "Kecamatan wajib diisi").optional(),
  jumlah_siswa: z.number().min(1, "Jumlah siswa wajib diisi"),
  latitude: z.number(),
  longitude: z.number(),
});

export const posyanduSchema = z.object({
  nama: z.string().min(1, "Nama wajib diisi"),
  alamat: z.string().min(1, "Alamat wajib diisi"),
  kelurahan_id: z.number().min(1, "Kelurahan wajib diisi"),
  kecamatan_id: z.number().min(1, "Kecamatan wajib diisi").optional(),
  jumlah_balita: z.number().min(1, "Jumlah balita wajib diisi"),
  jumlah_ibu_hamil: z.number().min(1, "Jumlah ibu hamil wajib diisi"),
  latitude: z.number(),
  longitude: z.number(),
});

export const driverSchema = z.object({
  nama: z.string().min(1, "Nama wajib diisi"),
  email: z
    .string()
    .min(1, { message: "Email wajib diisi" })
    .email("Email yang dimasukan tidak valid"),
  no_telepon: z.string().min(1, "No Telepon wajib diisi"),
  password: z
    .string()
    .min(1, "Password wajib diisi")
    .min(8, "Password minimal 8 karakter"),
});

export const driverPatchSchema = z.object({
  nama: z.string().min(1, "Nama wajib diisi"),
  status_aktif: z.boolean(),
  nomor_telepon: z.string().min(1, "No Telepon wajib diisi"),
});

export const tujuanSchema = z.object({
  tujuan_id: z.number().int().positive(),
  tujuan_type: z.enum(["sekolah", "posyandu"]),
});

export const pengirimanSchema = z.object({
  tujuan: z.array(tujuanSchema).min(1, "Minimal pilih satu tujuan"),
});
