import { getPendudukByNIK, getPesertaDidikByNISN } from '@/api/penduduk';
import { queryOptions } from '@tanstack/react-query';

export function getPendudukByNIKQueryOptions(nik: string) {
  return queryOptions({
    queryKey: ['penduduk_by_nik', nik],
    // queryFn: async () => {
    //   await new Promise((resolve) => setTimeout(resolve, 800));
    //   return mockDataSekolah;
    // },

    // QUERY FN KALAU SERVER HIDUP PLEASE UNCOMMENT KLO DIRUMAH
    queryFn: () => getPendudukByNIK(nik)
  });
}

export function getPesertaDidikByNISNQueryOptions(nisn: string) {
  return queryOptions({
    queryKey: ['peserta_didik_by_nisn', nisn],
    // queryFn: async () => {
    //   await new Promise((resolve) => setTimeout(resolve, 800));
    //   return mockDataSekolah;
    // },

    // QUERY FN KALAU SERVER HIDUP PLEASE UNCOMMENT KLO DIRUMAH
    queryFn: () => getPesertaDidikByNISN(nisn)
  });
}
