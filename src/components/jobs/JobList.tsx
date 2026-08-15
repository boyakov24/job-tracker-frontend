import { useState, useEffect } from "react";

import StatusBadge from "./StatusBadge";
import { getNotes } from "@/api/notes";
import { deleteJob } from "@/api/jobs";
import NoteList from "../notes/NotesList";
import AddJobDialog from "./AddJobDialog";
import type { Job, JobStatus } from "@/types/job";
import type { Note } from "@/types/note";

type JobListProps = {
  jobs: Job[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  currentParameters: {
    page: number;
    limit: number;
    status?: JobStatus;
    sortBy: "createdAt" | "company" | "position" | "status";
    order: "asc" | "desc";
  };
  onParameterChange: (
    parameters: Partial<JobListProps["currentParameters"]>,
  ) => void;
  onUpdated: () => void;
};

function JobList({
  jobs,
  meta,
  currentParameters,
  onParameterChange,
  onUpdated,
}: JobListProps) {
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);

  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoadingNotes, setIsLoadingNotes] = useState(false);

  const [editingJob, setEditingJob] = useState<Job | null>(null);

  const loadNotes = async (jobId: string) => {
    setIsLoadingNotes(true);

    try {
      const data = await getNotes(jobId);
      setNotes(data);
    } finally {
      setIsLoadingNotes(false);
    }
  };

  useEffect(() => {
    if (!expandedJobId) {
      setNotes([]);
      return;
    }

    loadNotes(expandedJobId);
  }, [expandedJobId]);

  const handleDeleteJob = async (jobId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this job?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteJob(jobId);

      if (expandedJobId === jobId) {
        setExpandedJobId(null);
      }

      onUpdated();
    } catch (error) {
      console.error("Failed to delete job:", error);
    }
  };

  const handleSort = (
    column: "company" | "position" | "status" | "createdAt",
  ) => {
    if (currentParameters.sortBy === column) {
      onParameterChange({
        order: currentParameters.order === "asc" ? "desc" : "asc",
      });
    } else {
      onParameterChange({ sortBy: column, order: "desc" });
    }
  };

  const renderSortIcon = (column: typeof currentParameters.sortBy) => {
    const baseClass = "text-md ml-1.5";

    const chosenClass = "text-xs ml-1.5";

    if (currentParameters.sortBy !== column) {
      return <span className={`${baseClass}`}>↕</span>;
    }

    return currentParameters.order === "asc" ? (
      <span className={`${chosenClass}`}>▼</span>
    ) : (
      <span className={`${chosenClass}`}>▲</span>
    );
  };

  if (jobs.length === 0 && !currentParameters.status) {
    return (
      <div className="mt-8 rounded-lg border border-dashed p-10 text-center">
        <h2 className="font-semibold">No jobs yet</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Start tracking your job applications by adding your first job.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="overflow-x-auto rounded-lg border bg-app-bg-color">
        <div className="min-w-[700px]">
          <div className="grid grid-cols-4 border-b bg-muted/50 px-4 py-3 text-md font-medium">
            <button
              type="button"
              onClick={() => handleSort("company")}
              className="flex items-center gap-1 text-left"
            >
              <span>Company</span>
              {renderSortIcon("company")}
            </button>

            <button
              type="button"
              onClick={() => handleSort("position")}
              className="flex items-center gap-1 text-left"
            >
              <span>Position</span>
              {renderSortIcon("position")}
            </button>

            <button
              type="button"
              onClick={() => handleSort("status")}
              className="flex items-center gap-1 text-left"
            >
              <span>Status</span>
              {renderSortIcon("status")}
            </button>

            <button
              type="button"
              onClick={() => handleSort("createdAt")}
              className="flex items-center gap-1 text-left"
            >
              <span>Applied</span>
              {renderSortIcon("createdAt")}
            </button>
          </div>

          {jobs.length === 0 && currentParameters.status ? (
            <div className="p-8 text-center text-muted-foreground text-sm font-medium">
              No jobs found with this status.
            </div>
          ) : (
            jobs.map((job) => (
              <div key={job.id} className="border-b last:border-b-0">
                <button
                  type="button"
                  onClick={() =>
                    setExpandedJobId(expandedJobId === job.id ? null : job.id)
                  }
                  className="grid w-full grid-cols-4 items-center px-4 py-4 text-left text-sm transition-colors hover:bg-muted/30"
                >
                  <span className="font-medium">{job.company}</span>
                  <span>{job.position}</span>
                  <StatusBadge status={job.status} />
                  <span className="flex items-center justify-between text-sm">
                    {new Date(job.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "2-digit",
                    })}
                    <span className="text-xl">
                      {expandedJobId === job.id ? "⌄" : "›"}
                    </span>
                  </span>
                </button>

                {expandedJobId === job.id && (
                  <div className="border-t bg-muted/20 px-4 py-4">
                    <p className="text-sm font-medium">Application Link</p>
                    {job.applicationUrl ? (
                      <a
                        href={job.applicationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 block text-sm text-app-indigo-600 hover:underline"
                      >
                        {job.applicationUrl}
                      </a>
                    ) : (
                      <p className="mt-1 text-sm text-muted-foreground">
                        No application link
                      </p>
                    )}

                    <div className="mt-6">
                      {isLoadingNotes ? (
                        <p className="text-sm text-muted-foreground">
                          Loading notes...
                        </p>
                      ) : (
                        <NoteList
                          jobId={job.id}
                          notes={notes}
                          onCreated={() => loadNotes(job.id)}
                        />
                      )}
                    </div>
                    <div className="mt-6 flex justify-end gap-2 border-t pt-4">
                      <button
                        type="button"
                        onClick={() => setEditingJob(job)}
                        className="rounded-md px-3 py-1.5 text-sm font-medium text-app-slate-600 hover:bg-app-hover-indigo hover:text-app-slate-800 transition-colors duration-200"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteJob(job.id)}
                        className="rounded-md px-3 py-1.5 text-sm font-medium text-app-rose-600 hover:bg-app-hover-rose transition-colors duration-200"
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {meta.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between px-2">
          <p className="text-sm text-muted-foreground">
            Showing page <span className="font-medium">{meta.page}</span> of{" "}
            <span className="font-medium">{meta.totalPages}</span> ({meta.total}{" "}
            jobs total)
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={meta.page <= 1}
              onClick={() => onParameterChange({ page: meta.page - 1 })}
              className="rounded-md border bg-app-white px-3 py-1.5 text-sm font-medium shadow-sm hover:bg-muted disabled:opacity-50 disabled:hover:bg-app-white transition-colors duration-200"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={meta.page >= meta.totalPages}
              onClick={() => onParameterChange({ page: meta.page + 1 })}
              className="rounded-md border bg-app-white px-3 py-1.5 text-sm font-medium shadow-sm hover:bg-muted disabled:opacity-50 disabled:hover:bg-app-white transition-colors duration-200"
            >
              Next
            </button>
          </div>
        </div>
      )}

      <AddJobDialog
        open={editingJob !== null}
        onOpenChange={(open) => {
          if (!open) setEditingJob(null);
        }}
        onCreated={() => {
          setEditingJob(null);
          onUpdated();
        }}
        job={editingJob ?? undefined}
      />
    </div>
  );
}

export default JobList;
