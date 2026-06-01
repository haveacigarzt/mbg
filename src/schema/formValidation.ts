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
  kecamatan_id: z.number().min(1, "Kecamatan wajib diisi"),
  jumlah_siswa: z.number().min(1, "Jumlah siswa wajib diisi"),
  latitude: z.number().min(0, "Latitude wajib diisi"),
  longitude: z.number().min(0, "Latitude wajib diisi"),
});
