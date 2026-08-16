import { http } from "./http";
import type { Job, JobStatus, JobsResponse } from "@/types/job";

export type GetJobsParams = {
  page?: number;
  limit?: number;
  status?: JobStatus;
  sortBy?: "createdAt" | "company" | "position" | "status";
  order?: "asc" | "desc";
};

export type CreateJobData = {
  company: string;
  position: string;
  status?: JobStatus;
  applicationUrl?: string;
};

export type UpdateJobData = Partial<CreateJobData>;

export async function getJobs(params?: GetJobsParams): Promise<JobsResponse> {
  const response = await http.get<JobsResponse>("/jobs", { params });

  return response.data;
}

export async function createJob(data: CreateJobData): Promise<Job> {
  const response = await http.post<Job>("/jobs", data);

  return response.data;
}

export async function updateJob(
  jobId: string,
  data: UpdateJobData,
): Promise<Job> {
  const response = await http.patch<Job>(`/jobs/${jobId}`, data);

  return response.data;
}

export async function deleteJob(jobId: string): Promise<void> {
  await http.delete(`/jobs/${jobId}`);
}
