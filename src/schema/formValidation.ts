import { z } from 'zod';

const socialUrlSchema = z.url('URL tidak valid').refine((url) => url.includes('instagram.com') || url.includes('facebook.com') || url.includes('tiktok.com') || url.includes('youtube.com'), {
  message: 'URL harus berasal dari media sosial yang didukung (Instagram, Facebook, TikTok, YouTube)'
});

export const sppgSchema = z.object({
  nama: z.string().min(1, 'Nama wajib diisi'),
  alamat: z.string().min(1, 'Alamat wajib diisi'),
  kepala_sppg: z.string().min(1, 'Kepala SPPG wajib diisi'),
  nomor_telepon: z.string().min(1, 'Nomor telepon wajib diisi'),
  email: z.email('Email tidak valid'),

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
    z.array(socialUrlSchema).max(3, 'Maksimal 3 URL')
  )
});

export const sppgNewSchema = z
  .object({
    nama: z.string().trim().min(1, 'Nama SPPG wajib diisi'),

    alamat: z.string().trim().min(1, 'Alamat wajib diisi'),

    kepala_sppg: z.string().trim().min(1, 'Nama kepala SPPG wajib diisi'),

    nomor_telepon: z
      .string()
      .trim()
      .min(10, 'Nomor telepon tidak valid')
      .max(15, 'Nomor telepon tidak valid')
      .regex(/^[0-9]+$/, 'Nomor telepon hanya boleh berisi angka'),

    email: z.string().trim().email('Email SPPG tidak valid'),

    kelurahan_id: z.number().min(1, 'Kelurahan wajib dipilih'),

    kecamatan_id: z.number().min(1, 'Kecamatan wajib dipilih'),

    kapasitas_porsi: z.number().min(1, 'Kapasitas porsi harus lebih dari 0'),

    latitude: z.number().min(-90, 'Latitude tidak valid').max(90, 'Latitude tidak valid'),

    longitude: z.number().min(-180, 'Longitude tidak valid').max(180, 'Longitude tidak valid'),

    sosmed_url: z.array(z.string().url('URL media sosial tidak valid')),

    email_user: z.string().trim().email('Email pengguna tidak valid'),

    password: z.string().min(8, 'Password minimal 8 karakter'),

    konfirmasi_password: z.string().min(1, 'Konfirmasi password wajib diisi')
  })
  .refine((data) => data.password === data.konfirmasi_password, {
    path: ['konfirmasi_password'],
    message: 'Konfirmasi password tidak sama'
  });

export const sekolahSchema = z.object({
  nama: z.string().min(1, 'Nama wajib diisi'),
  alamat: z.string().min(1, 'Alamat wajib diisi'),
  tingkat: z.enum(['SD', 'SMP', 'SMA'], 'Tingkat harus SD, SMP, atau SMA'),
  kelurahan_id: z.number().min(1, 'Kelurahan wajib diisi'),
  kecamatan_id: z.number().min(1, 'Kecamatan wajib diisi').optional(),
  jumlah_siswa: z.number().min(1, 'Jumlah siswa wajib diisi'),
  latitude: z.number(),
  longitude: z.number()
});

export const posyanduSchema = z.object({
  nama: z.string().min(1, 'Nama wajib diisi'),
  alamat: z.string().min(1, 'Alamat wajib diisi'),
  kelurahan_id: z.number().min(1, 'Kelurahan wajib diisi'),
  kecamatan_id: z.number().min(1, 'Kecamatan wajib diisi').optional(),
  jumlah_balita: z.number().min(1, 'Jumlah balita wajib diisi'),
  jumlah_ibu_hamil: z.number().min(1, 'Jumlah ibu hamil wajib diisi'),
  latitude: z.number(),
  longitude: z.number()
});

export const driverSchema = z.object({
  nama: z.string().min(1, 'Nama wajib diisi'),
  email: z.string().min(1, { message: 'Email wajib diisi' }).email('Email yang dimasukan tidak valid'),
  no_telepon: z.string().min(1, 'No Telepon wajib diisi'),
  password: z.string().min(1, 'Password wajib diisi').min(8, 'Password minimal 8 karakter')
});

export const driverPatchSchema = z.object({
  nama: z.string().min(1, 'Nama wajib diisi'),
  status_aktif: z.boolean(),
  nomor_telepon: z.string().min(1, 'No Telepon wajib diisi')
});

export const tujuanSchema = z.object({
  tujuan_id: z.number().int().positive(),
  tujuan_type: z.enum(['sekolah', 'posyandu'])
});

export const pengirimanSchema = z.object({
  tujuan: z.array(tujuanSchema).min(1, 'Minimal pilih satu tujuan')
});

// 20/06/2026
export const pengeluaranSchema = z.object({
  jumlah: z.number().min(1, 'Jumlah wajib diisi'),
  produk: z.string().min(1, 'Produk wajib diisi'),
  harga_satuan: z.number().min(1, 'Harga satuan wajib diisi'),
  pedagang_lokal_id: z.number().min(0, 'Pedagang lokal wajib dipilih'),
  satuan: z.string().min(1, 'Satuan wajib diisi')
});
export const alokasiSchema = z.object({
  tanggal: z.string().min(10, 'Tanggal wajib diisi'),
  jumlah: z.number().min(1, 'Jumlah wajib diisi')
});
export const tambahUserSchema = z
  .object({
    role_id: z.enum(['2', '3']),
    name: z.string().trim().min(3, 'Nama minimal 3 karakter').max(100, 'Nama maksimal 100 karakter'),
    email: z.string().trim().email('Format email tidak valid'),
    password: z
      .string()
      .min(8, 'Password minimal 8 karakter')
      .max(15, 'Password maksimal 15 karakter')
      .regex(/^(?=.*[A-Za-z])(?=.*\d).+$/, 'Password harus mengandung huruf dan angka'),

    konfirmasi_password: z.string()
  })
  .refine((data) => data.password === data.konfirmasi_password, {
    message: 'Konfirmasi password tidak sesuai',
    path: ['konfirmasi_password']
  });
export const produksiSchema = z
  .object({
    tanggal: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal harus YYYY-MM-DD'),

    waktu_mulai: z.string().datetime({ offset: true }),

    estimasi_waktu_selesai: z.string().datetime({ offset: true })
  })
  .refine((data) => new Date(data.waktu_mulai).getTime() < new Date(data.estimasi_waktu_selesai).getTime(), {
    path: ['estimasi_waktu_selesai'],
    message: 'Estimasi waktu selesai harus setelah waktu mulai'
  });
