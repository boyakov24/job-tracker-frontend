import { useState } from "react";

function DemoBoard() {
  const [expandedJob, setExpandedJob] = useState<number | null>(null);

  const jobs = [
    {
      company: "Google",
      position: "Backend Developer",
      status: "Interview",
      statusStyle: "interview",
      applied: "Jun 24",
      applicationUrl: "https://google.com/careers",
      note: "Prepare for the technical interview.",
      noteDate: "25.07.2026",
      reminder: "Jun 26, 10:00",
    },
    {
      company: "Stripe",
      position: "Node.js Developer",
      status: "Applied",
      statusStyle: "applied",
      applied: "Jun 21",
      applicationUrl: "",
      note: "Follow up with the recruiter.",
      noteDate: "23.07.26",
      reminder: "",
    },
    {
      company: "Spotify",
      position: "Backend Engineer",
      status: "Offer",
      statusStyle: "offer",
      applied: "Jun 18",
      applicationUrl: "https://spotify.com/jobs",
      note: "",
      noteDate: "",
      reminder: "Jun 25, 09:00",
    },
    {
      company: "Amazon",
      position: "Software Engineer",
      status: "Rejected",
      statusStyle: "rejected",
      applied: "Jun 15",
      applicationUrl: "",
      note: "",
      noteDate: "",
      reminder: "",
    },
  ];

  return (
    <div className="w-full rounded-xl border bg-app-bg-color p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Your applications</h2>
          <p className="text-sm text-muted-foreground">
            Keep track of your job search
          </p>
        </div>

        <button
          type="button"
          className="rounded-md bg-app-sky-500 px-4 py-2 text-sm text-app-white shadow-sm shadow-sky-500/10 hover:bg-app-sky-600 transition-colors duration-200"
        >
          + Add job
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <div className="min-w-[700px]">
          <div className="grid grid-cols-4 border-b bg-muted/50 px-4 py-3 text-sm font-medium">
            <span>Company</span>
            <span>Position</span>
            <span>Status</span>
            <span>Applied</span>
          </div>

          {jobs.map((job, index) => (
            <div key={job.company}>
              <div
                onClick={() =>
                  setExpandedJob(expandedJob === index ? null : index)
                }
                className="grid grid-cols-4 items-center border-t px-4 py-4 text-sm transition-colors hover:bg-muted/30 cursor-pointer"
              >
                <span className="font-medium">{job.company}</span>

                <span>{job.position}</span>

                <div>
                  {job.statusStyle === "interview" && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-app-indigo-600/10 px-2.5 py-1 text-sm font-medium text-app-indigo-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-app-indigo-600" />
                      {job.status}
                    </span>
                  )}

                  {job.statusStyle === "applied" && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-app-slate-100 px-2.5 py-1 text-sm font-medium text-app-slate-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-app-slate-400" />
                      {job.status}
                    </span>
                  )}

                  {job.statusStyle === "offer" && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-app-emerald-400/10 px-2.5 py-1 text-sm font-medium text-app-emerald-500">
                      <span className="h-1.5 w-1.5 rounded-full bg-app-emerald-400" />
                      {job.status}
                    </span>
                  )}

                  {job.statusStyle === "rejected" && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-app-rose-50 px-2.5 py-1 text-sm font-medium text-app-rose-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-app-rose-400" />
                      {job.status}
                    </span>
                  )}
                </div>

                <span className="flex items-center justify-between text-sm">
                  {job.applied}
                  <span className="text-xl">
                    {expandedJob === index ? "⌄" : "›"}
                  </span>
                </span>
              </div>

              {expandedJob === index && (
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
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium">Notes</h3>
                      {job.note ? (
                        <div className="flex items-start justify-between gap-4 rounded-md border bg-app-bg-color p-3">
                          <div>
                            <p className="text-sm">{job.note}</p>

                            <p className="mt-2 text-xs text-muted-foreground">
                              {job.noteDate}
                            </p>
                          </div>

                          <div className="flex shrink-0 items-center gap-1 pt-1">
                            <button
                              type="button"
                              className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-app-hover-indigo transition-colors duration-200"
                            >
                              <span className="text-md">✏️</span>
                            </button>

                            <button
                              type="button"
                              className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-app-hover-amber transition-colors duration-200"
                            >
                              <span className="text-md">🔔</span>
                            </button>

                            {job.reminder && (
                              <span className="text-xs text-app-slate-500">
                                {job.reminder}
                              </span>
                            )}
                            <button
                              type="button"
                              className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-app-hover-rose transition-colors duration-200"
                            >
                              <span className="text-md">🗑</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No notes yet.
                        </p>
                      )}
                      <button
                        type="button"
                        className="text-sm font-medium text-app-indigo-500 hover:text-app-indigo-700 transition-colors duration-200"
                      >
                        + Create Note
                      </button>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end gap-2 border-t pt-4">
                    <button
                      type="button"
                      className="rounded-md px-3 py-1.5 text-sm font-medium text-app-slate-600 hover:bg-app-hover-indigo hover:text-app-slate-800 transition-colors duration-200"
                    >
                      ✏️ Edit
                    </button>

                    <button
                      type="button"
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
      </div>
    </div>
  );
}

export default DemoBoard;
