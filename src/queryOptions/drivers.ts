import { mutationOptions, queryOptions } from "@tanstack/react-query";
import type {
  GetDriversParams,
  PatchDriver,
  PostDriver,
} from "../types/drivers";
import { createDriver, getDrivers, updateDriver } from "../api/drivers";

export function getDriversQueryOptions(params?: GetDriversParams) {
  return queryOptions({
    queryKey: ["drivers", params],
    queryFn: () => getDrivers(params),
  });
}

export function createDriverMutationOptions() {
  return mutationOptions({
    mutationFn: ({ input }: { input: PostDriver }) => createDriver(input),
  });
}

export function updateDriverMutationOptions() {
  return mutationOptions({
    mutationFn: ({ input, id }: { input: PatchDriver; id: number }) =>
      updateDriver(input, id),
  });
}
