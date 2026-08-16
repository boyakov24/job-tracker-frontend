import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createJob,
  getJobs,
  updateJob,
  deleteJob,
  type CreateJobData,
  type UpdateJobData,
  type GetJobsParams,
} from "@/api/jobs";

const JOBS_QUERY_KEY = ["jobs"];

export function useJobs(params?: GetJobsParams) {
  return useQuery({
    queryKey: [...JOBS_QUERY_KEY, params],
    queryFn: () => getJobs(params),
  });
}

export function useCreateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateJobData) => createJob(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: JOBS_QUERY_KEY });
    },
  });
}

export function useUpdateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ jobId, data }: { jobId: string; data: UpdateJobData }) =>
      updateJob(jobId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: JOBS_QUERY_KEY });
    },
  });
}

export function useDeleteJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobId: string) => deleteJob(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: JOBS_QUERY_KEY });
    },
  });
}
