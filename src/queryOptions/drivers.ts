import { mutationOptions, queryOptions } from "@tanstack/react-query";
import type {
  GetDriversParams,
  PatchDriver,
  PostDriver,
} from "../types/drivers";
import {
  createDriver,
  deleteDriver,
  getDriverCurrent,
  getDrivers,
  updateDriver,
} from "../api/drivers";

export function getDriversQueryOptions(params?: GetDriversParams) {
  return queryOptions({
    queryKey: ["drivers", params],
    queryFn: () => getDrivers(params),
  });
}

export function getDriverCurrentQueryOptions() {
  return queryOptions({
    queryKey: ["driver"],
    queryFn: getDriverCurrent,
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

export function deleteDriverMutationOptions() {
  return mutationOptions({
    mutationFn: (driver_id: number) => deleteDriver(driver_id),
  });
}
