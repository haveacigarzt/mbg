import { mutationOptions, queryOptions } from '@tanstack/react-query';
import type { GetPedagangLokalParams } from '@/types/pedaganglokal';
import { getPedagangLokal } from '@/api/pedaganglokal';

export function getPedagangLokalQueryOptions(params?: GetPedagangLokalParams) {
  return queryOptions({
    queryKey: ['pedagang-lokal', params],
    queryFn: () => getPedagangLokal(params)
  });
}
