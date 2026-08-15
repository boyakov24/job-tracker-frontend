import { http } from "./http";

import type { Job, JobStatus, JobsResponse } from "@/types/job";

export async function getJobs(params?: {
  page?: number;
  limit?: number;
  status?: JobStatus;
  sortBy?: "createdAt" | "company" | "position" | "status";
  order?: "asc" | "desc";
}) {
  const response = await http.get<JobsResponse>("/jobs", { params });

  return response.data;
}

type CreateJobData = {
  company: string;
  position: string;
  status?: JobStatus;
  applicationUrl?: string;
};

export async function createJob(data: CreateJobData): Promise<Job> {
  const response = await http.post<Job>("/jobs", data);

  return response.data;
}

export async function updateJob(
  jobId: string,
  data: {
    company?: string;
    position?: string;
    status?: JobStatus;
    applicationUrl?: string;
  },
): Promise<Job> {
  const response = await http.patch<Job>(`/jobs/${jobId}`, data);

  return response.data;
}

export async function deleteJob(jobId: string) {
  await http.delete(`/jobs/${jobId}`);
}
