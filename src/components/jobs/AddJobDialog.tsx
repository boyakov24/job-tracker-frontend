import { useState, useEffect } from "react";
import axios from "axios";

import { createJob, updateJob } from "@/api/jobs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type JobStatus = "applied" | "interview" | "offer" | "rejected";

type Job = {
  id: string;
  company: string;
  position: string;
  status: JobStatus;
  applicationUrl: string | null;
};

type AddJobDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: () => void;
  job?: Job;
};

function AddJobDialog({
  open,
  onOpenChange,
  onCreated,
  job,
}: AddJobDialogProps) {
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [applicationUrl, setApplicationUrl] = useState("");
  const [status, setStatus] = useState<
    "applied" | "interview" | "offer" | "rejected"
  >("applied");

  useEffect(() => {
    if (job) {
      setCompany(job.company);
      setPosition(job.position);
      setStatus(job.status);
      setApplicationUrl(job.applicationUrl ?? "");
    } else {
      setCompany("");
      setPosition("");
      setStatus("applied");
      setApplicationUrl("");
    }
  }, [job, open]);

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      if (job) {
        await updateJob(job.id, {
          company,
          position,
          status,
          applicationUrl: applicationUrl || undefined,
        });
      } else {
        await createJob({
          company,
          position,
          status,
          applicationUrl: applicationUrl || undefined,
        });
      }

      setCompany("");
      setPosition("");
      setStatus("applied");
      setApplicationUrl("");

      onOpenChange(false);
      onCreated();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Backend validation:", error.response?.data?.message);
      } else {
        console.error("Unknown error:", error);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-xl shadow-slate-200/50">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-bold tracking-tight text-[#0f172a]">
            {job ? "Edit job" : "Add job"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="company" className="text-sm font-medium">
              Company
            </label>

            <input
              id="company"
              value={company}
              onChange={(event) => setCompany(event.target.value)}
              placeholder="e.g. Google"
              required
              className="rounded-lg border border-slate-200 px-3.5 py-2.5 text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="position" className="text-sm font-medium">
              Position
            </label>

            <input
              id="position"
              value={position}
              onChange={(event) => setPosition(event.target.value)}
              placeholder="e.g. Backend Developer"
              required
              className="rounded-lg border border-slate-200 px-3.5 py-2.5 text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="status" className="text-sm font-medium">
              Status
            </label>

            <div className="relative">
              <select
                id="status"
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target.value as
                      | "applied"
                      | "interview"
                      | "offer"
                      | "rejected",
                  )
                }
                className="w-full appearance-none rounded-lg border border-slate-200 px-3.5 py-2.5 pr-10 text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="applied">Applied</option>
                <option value="interview">Interview</option>
                <option value="offer">Offer</option>
                <option value="rejected">Rejected</option>
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-lg -translate-y-[4px]">
                ⌄
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="applicationUrl" className="text-sm font-medium">
              Application URL
            </label>

            <input
              id="applicationUrl"
              type="url"
              value={applicationUrl}
              onChange={(event) => setApplicationUrl(event.target.value)}
              placeholder="https://..."
              className="rounded-lg border border-slate-200 px-3.5 py-2.5 text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 rounded-lg bg-[#0ea5e9] py-3 font-semibold text-white transition-colors duration-200 hover:bg-[#0284c7] focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] focus:ring-offset-2"
          >
            Save
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddJobDialog;
