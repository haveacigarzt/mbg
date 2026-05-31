import { z } from "zod";

export const sppgSchema = z.object({
  nama: z.string().min(1),
  alamat: z.string().min(1),
  kepala_sppg: z.string().min(1),
  nomor_telepon: z.string().min(1),
  email: z.string().email(),

  kelurahan: z.string(),
  kecamatan: z.string(),

  kapasitas_porsi: z.number().min(0),

  status_aktif: z.boolean(),

  latitude: z.number(),
  longitude: z.number(),

  sosmed_url: z.array(z.string().url()).default([]),
});

export type SppgForm = z.infer<typeof sppgSchema>;
