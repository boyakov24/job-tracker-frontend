import { useState, useEffect } from "react";

import StatusBadge from "./StatusBadge";
import { getNotes } from "@/api/notes";
import { deleteJob } from "@/api/jobs";
import NoteList from "../notes/NotesList";
import AddJobDialog from "./AddJobDialog";
import type { Job } from "@/types/job";
import type { Note } from "@/types/note";

type JobListProps = {
  jobs: Job[];
  onUpdated: () => void;
};

function JobList({ jobs, onUpdated }: JobListProps) {
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

  if (jobs.length === 0) {
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
    <div className="mt-8 overflow-x-auto rounded-lg border bg-app-bg-color">
      <div className="min-w-[700px]">
        <div className="grid grid-cols-4 border-b bg-muted/50 px-4 py-3 text-md font-medium">
          <span>Company</span>
          <span>Position</span>
          <span>Status</span>
          <span>Applied</span>
        </div>

        {jobs.map((job) => (
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
        ))}
      </div>
      <AddJobDialog
        open={editingJob !== null}
        onOpenChange={(open) => {
          if (!open) {
            setEditingJob(null);
          }
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
