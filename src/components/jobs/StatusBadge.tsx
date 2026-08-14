import type { JobStatus } from "@/types/job";

type StatusBadgeProps = {
  status: JobStatus;
};

const statusStyles: Record<JobStatus, string> = {
  applied: "bg-app-slate-100 text-app-slate-600",
  interview: "bg-app-indigo-600/10 text-app-indigo-600",
  offer: "bg-app-emerald-400/10 text-app-emerald-400",
  rejected: "bg-app-rose-50 text-app-rose-600",
};

function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 capitalize text-sm font-medium ${statusStyles[status]}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          status === "applied"
            ? "bg-app-slate-400"
            : status === "interview"
              ? "bg-app-indigo-600"
              : status === "offer"
                ? "bg-app-emerald-400"
                : "bg-app-rose-400"
        }`}
      />

      {status}
    </span>
  );
}

export default StatusBadge;
