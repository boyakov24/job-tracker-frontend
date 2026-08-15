import { useQuery } from "@tanstack/react-query";

import { getJobs } from "@/api/jobs";

import type { JobStatus } from "@/types/job";

export function useJobs(params?: {
  page?: number;
  limit?: number;
  status?: JobStatus;
  sortBy?: "createdAt" | "company" | "position" | "status";
  order?: "asc" | "desc";
}) {
  return useQuery({
    queryKey: ["jobs", params],
    queryFn: () => getJobs(params),
  });
}
