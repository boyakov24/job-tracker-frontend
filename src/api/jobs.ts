import { http } from "./http";

export async function getJobs() {
  const response = await http.get("/jobs");

  return response.data;
}

type CreateJobData = {
  company: string;
  position: string;
  status?: "applied" | "interview" | "offer" | "rejected";
  applicationUrl?: string;
};

export async function createJob(data: CreateJobData) {
  const response = await http.post("/jobs", data);

  return response.data;
}

export async function updateJob(
  jobId: string,
  data: {
    company?: string;
    position?: string;
    status?: "applied" | "interview" | "offer" | "rejected";
    applicationUrl?: string;
  },
) {
  const response = await http.patch(`/jobs/${jobId}`, data);

  return response.data;
}

export async function deleteJob(jobId: string) {
  await http.delete(`/jobs/${jobId}`);
}
