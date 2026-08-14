import { useState } from "react";

import JobList from "@/components/jobs/JobList";
import { useJobs } from "@/hooks/use-jobs";
import AddJobDialog from "@/components/jobs/AddJobDialog";

function DashboardPage() {
  const { data, isLoading, isError, error, refetch } = useJobs();

  const [isAddJobOpen, setIsAddJobOpen] = useState(false);
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

        {isLoading && (
          <p className="mt-8 text-muted-foreground">Loading jobs...</p>
        )}

        {isError && (
          <pre className="mt-8 overflow-auto rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {JSON.stringify(error, null, 2)}
          </pre>
        )}

        {data && <JobList jobs={data.data} onUpdated={refetch} />}
      </div>

      <AddJobDialog
        open={isAddJobOpen}
        onOpenChange={setIsAddJobOpen}
        onCreated={refetch}
      />
    </main>
  );
}

export default DashboardPage;
