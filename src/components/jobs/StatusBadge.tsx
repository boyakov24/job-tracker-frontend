import type { JobStatus } from "@/types/job";

type StatusBadgeProps = {
  status: JobStatus;
};

const statusStyles: Record<JobStatus, string> = {
  applied: "bg-slate-100 text-slate-600",
  interview: "bg-[#4f46e5]/10 text-[#4f46e5]",
  offer: "bg-[#34d399]/10 text-[#34d399]",
  rejected: "bg-rose-50 text-rose-600",
};

function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 capitalize text-sm font-medium ${statusStyles[status]}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          status === "applied"
            ? "bg-slate-400"
            : status === "interview"
              ? "bg-[#4f46e5]"
              : status === "offer"
                ? "bg-[#34d399]"
                : "bg-rose-400"
        }`}
      />

      {status}
    </span>
  );
}

export default StatusBadge;
