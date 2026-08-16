import { useState } from "react";
import axios from "axios";
import type { Job, JobStatus } from "@/types/job";
import { useCreateJob, useUpdateJob } from "@/hooks/use-jobs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ValidatedInput from "../ui/validated-input";

type AddJobDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job?: Job;
};

export function AddJobDialog({ open, onOpenChange, job }: AddJobDialogProps) {
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [applicationUrl, setApplicationUrl] = useState("");
  const [status, setStatus] = useState<JobStatus>("applied");

  const [companyError, setCompanyError] = useState("");
  const [positionError, setPositionError] = useState("");
  const [applicationUrlError, setApplicationUrlError] = useState("");

  const [prevJob, setPrevJob] = useState<Job | undefined>(undefined);
  const [prevOpen, setPrevOpen] = useState(false);

  if (job !== prevJob || open !== prevOpen) {
    setPrevJob(job);
    setPrevOpen(open);

    // Синхронизируем стейт формы прямо во время рендера (без эффектов!)
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
    setCompanyError("");
    setPositionError("");
    setApplicationUrlError("");
  }

  const createJobMutation = useCreateJob();
  const updateJobMutation = useUpdateJob();

  const isPending = createJobMutation.isPending || updateJobMutation.isPending;

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    let hasError = false;

    if (!company.trim()) {
      setCompanyError("This field is required");
      hasError = true;
    } else {
      setCompanyError("");
    }

    if (!position.trim()) {
      setPositionError("This field is required");
      hasError = true;
    } else {
      setPositionError("");
    }

    if (hasError) return;

    const trimmedUrl = applicationUrl.trim();

    const payload = {
      company: company.trim(),
      position: position.trim(),
      status,
      applicationUrl: job ? trimmedUrl : trimmedUrl || undefined,
    };

    const handleSuccess = () => {
      setCompany("");
      setPosition("");
      setStatus("applied");
      setApplicationUrl("");

      setCompanyError("");
      setPositionError("");
      setApplicationUrlError("");

      onOpenChange(false);
    };

    const handleError = (error: unknown) => {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;

        if (
          Array.isArray(message) &&
          message.some((item) => item.includes("applicationUrl"))
        ) {
          setApplicationUrlError("URL is invalid");
        }
      } else {
        console.error("Unknown error:", error);
      }
    };

    if (job) {
      updateJobMutation.mutate(
        { jobId: job.id, data: payload },
        { onSuccess: handleSuccess, onError: handleError },
      );
    } else {
      createJobMutation.mutate(payload, {
        onSuccess: handleSuccess,
        onError: handleError,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[425px] rounded-2xl border border-app-slate-200 bg-app-white p-6 shadow-xl shadow-slate-200/50"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-bold tracking-tight text-app-slate-900">
            {job ? "Edit job" : "Add job"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="company" className="text-sm font-medium">
              Company
            </label>

            <ValidatedInput
              id="company"
              value={company}
              onChange={(event) => {
                setCompany(event.target.value);
                setCompanyError("");
              }}
              autoComplete="off"
              placeholder="e.g. Google"
              error={companyError}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="position" className="text-sm font-medium">
              Position
            </label>

            <ValidatedInput
              id="position"
              value={position}
              onChange={(event) => {
                setPosition(event.target.value);
                setPositionError("");
              }}
              autoComplete="off"
              placeholder="e.g. Backend Developer"
              error={positionError}
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
                onChange={(event) => setStatus(event.target.value as JobStatus)}
                className="w-full appearance-none rounded-lg border border-slate-200 px-3.5 py-2.5 pr-10 text-app-slate-900 placeholder-app-slate-400 outline-none transition-all focus:border-app-indigo-500 focus:ring-2 focus:ring-app-indigo-500/20"
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

            <ValidatedInput
              id="applicationUrl"
              type="url"
              value={applicationUrl}
              onChange={(event) => {
                setApplicationUrl(event.target.value);
                setApplicationUrlError("");
              }}
              autoComplete="off"
              placeholder="https://..."
              error={applicationUrlError}
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full mt-2 rounded-lg bg-app-sky-500 py-3 font-semibold text-app-white transition-colors duration-200 shadow-sm shadow-sky-500/10 hover:bg-app-sky-600 focus:outline-none focus:ring-2 focus:ring-app-sky-500 focus:ring-offset-2 disabled:opacity-5"
          >
            {isPending ? "Saving..." : "Save"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddJobDialog;
