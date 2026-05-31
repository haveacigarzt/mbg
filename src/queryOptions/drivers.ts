import { queryOptions } from "@tanstack/react-query";
import type { GetDriversParams } from "../types/drivers";
import { getDrivers } from "../api/drivers";

export function getDriversQueryOptions(params?: GetDriversParams) {
  return queryOptions({
    queryKey: ["drivers", params],
    queryFn: () => getDrivers(params),
  });
}
