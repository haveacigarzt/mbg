import { queryOptions } from '@tanstack/react-query';
import { getSummaryDapur, getSummaryPenerimaManfaat } from '@/api/summary';

export function getSummaryPenerimaManfaatQueryOptions() {
  return queryOptions({
    queryKey: ['summary_penerima_manfaat'],
    queryFn: () => getSummaryPenerimaManfaat()
  });
}

export function getSummaryDapurQueryOptions() {
  return queryOptions({
    queryKey: ['summary_dapur'],
    queryFn: () => getSummaryDapur()
  });
}
