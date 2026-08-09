function DemoBoard() {
  return (
    <div className="w-full rounded-xl border bg-background p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Your applications</h2>
          <p className="text-sm text-muted-foreground">
            Keep track of your job search
          </p>
        </div>

        <button
          type="button"
          className="rounded-md bg-[#0ea5e9] px-4 py-2 text-sm text-white shadow-sm shadow-sky-500/10 hover:bg-[#0284c7] transition-colors duration-200"
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

          <div className="grid grid-cols-4 items-center px-4 py-4 text-sm transition-colors hover:bg-muted/30">
            <span className="font-medium">Google</span>
            <span>Backend Developer</span>
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#4f46e5]/10 px-2.5 py-1 text-sm font-medium text-[#4f46e5]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#4f46e5]" />
                Interview
              </span>
            </div>
            <span>Jun 24</span>
          </div>

          <div className="grid grid-cols-4 items-center border-t px-4 py-4 text-sm transition-colors hover:bg-muted/30">
            <span className="font-medium">Stripe</span>
            <span>Node.js Developer</span>
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-sm font-medium text-slate-600">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                Applied
              </span>
            </div>
            <span>Jun 21</span>
          </div>

          <div className="grid grid-cols-4 items-center border-t px-4 py-4 text-sm transition-colors hover:bg-muted/30">
            <span className="font-medium">Spotify</span>
            <span>Backend Engineer</span>
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#34d399]/10 px-2.5 py-1 text-sm font-medium text-[#10b981]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#34d399]" />
                Offer
              </span>
            </div>
            <span>Jun 18</span>
          </div>

          <div className="grid grid-cols-4 items-center border-t px-4 py-4 text-sm transition-colors hover:bg-muted/30">
            <span className="font-medium">Amazon</span>
            <span>Software Engineer</span>
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-sm font-medium text-rose-600">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                Rejected
              </span>
            </div>
            <span>Jun 15</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DemoBoard;
