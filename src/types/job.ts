export type JobStatus = "applied" | "interview" | "offer" | "rejected";

export type Job = {
  id: string;
  userId: string;
  company: string;
  position: string;
  status: JobStatus;
  applicationUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type JobsResponse = {
  data: Job[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
