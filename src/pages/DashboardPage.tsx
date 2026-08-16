import { useState } from "react";
import JobList from "@/components/jobs/JobList";
import { useJobs } from "@/hooks/use-jobs";
import AddJobDialog from "@/components/jobs/AddJobDialog";
import type { JobStatus } from "@/types/job";

const STATUS_OPTIONS: { value: JobStatus | "all"; label: string }[] = [
  { value: "all", label: "All Statuses" },
  { value: "applied", label: "Applied" },
  { value: "interview", label: "Interview" },
  { value: "offer", label: "Offer" },
  { value: "rejected", label: "Rejected" },
];

export function DashboardPage() {
  const [parameters, setParameters] = useState<{
    page: number;
    limit: number;
    status?: JobStatus;
    sortBy: "createdAt" | "company" | "position" | "status";
    order: "asc" | "desc";
  }>({
    page: 1,
    limit: 10,
    status: undefined,
    sortBy: "createdAt",
    order: "desc",
  });

  const { data, isLoading, isError, error } = useJobs(parameters);

  const [isAddJobOpen, setIsAddJobOpen] = useState(false);

  const updateFilter = (newParameters: Partial<typeof parameters>) => {
    setParameters((prev) => {
      const updated = { ...prev, ...newParameters };

      if (newParameters.page === undefined) {
        updated.page = 1;
      }
      return updated;
    });
  };

  return (
    <main className="min-h-[calc(100vh-73px)] bg-app-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

            <p className="mt-2 text-muted-foreground">
              Keep track of your job applications.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddJobOpen(true)}
            className="rounded-md bg-app-sky-500 px-4 py-2 text-sm font-medium text-app-white shadow-sm shadow-sky-500/10 hover:bg-app-sky-600 transition-colors duration-200"
          >
            + Add job
          </button>
        </div>

        <div className="mt-4 flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-3">
            <label
              htmlFor="status-filter"
              className="text-sm font-medium text-muted-foreground"
            >
              Filter by status:
            </label>
            <select
              id="status-filter"
              value={parameters.status ?? "all"}
              onChange={(e) => {
                const val = e.target.value;
                updateFilter({
                  status: val === "all" ? undefined : (val as JobStatus),
                });
              }}
              className="rounded-md border bg-app-white px-3 py-1.5 text-sm font-medium shadow-sm outline-none transition-colors duration-200 focus:border-app-sky-500 hover:bg-muted"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <span className="text-sm font-medium text-muted-foreground">
            Per page:
          </span>
          <select
            value={parameters.limit}
            onChange={(e) => updateFilter({ limit: Number(e.target.value) })}
            className="rounded-md border bg-app-white px-2 py-1 text-sm outline-none"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </select>
        </div>

        {isLoading && (
          <p className="mt-8 text-muted-foreground">Loading jobs...</p>
        )}

        {isError && (
          <pre className="mt-8 overflow-auto rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {JSON.stringify(error, null, 2)}
          </pre>
        )}

        {data && (
          <JobList
            jobs={data.data}
            meta={{
              page: data.page,
              limit: data.limit,
              total: data.total,
              totalPages: data.totalPages,
            }}
            currentParameters={parameters}
            onParameterChange={updateFilter}
          />
        )}
      </div>

      <AddJobDialog open={isAddJobOpen} onOpenChange={setIsAddJobOpen} />
    </main>
  );
}

export default DashboardPage;
