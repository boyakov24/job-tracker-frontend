import { useState } from "react";
import ReminderDialog from "../reminders/ReminderDialog";
import { useCreateNote, useUpdateNote, useDeleteNote } from "@/hooks/use-notes";
import { useReminder } from "@/hooks/use-reminders";
import type { Note } from "@/types/note";

type NoteListProps = {
  jobId: string;
  notes: Note[];
};

function NoteItem({
  note,
  jobId,
  onEdit,
  onSetReminder,
}: {
  note: Note;
  jobId: string;
  onEdit: () => void;
  onSetReminder: () => void;
}) {
  const { data: reminder } = useReminder(note.id);
  const deleteNoteMutation = useDeleteNote(jobId);

  const handleDelete = () => {
    if (!window.confirm("Are you sure you want to delete this reminder?")) {
      return;
    }
    deleteNoteMutation.mutate(note.id);
  };

  return (
    <div
      className={`flex items-start justify-between gap-4 rounded-md border bg-app-bg-color p-3 ${reminder?.sentAt ? "opacity-60" : ""}`}
    >
      <div>
        <p className="text-sm">{note.content}</p>

        <p className="mt-2 text-xs text-muted-foreground">
          {new Date(note.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-1 pt-1">
        {reminder?.sentAt ? (
          <>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-app-emerald-400/10 px-2.5 py-1 text-sm font-medium text-app-emerald-500">
              ✓ Completed ·{" "}
              {new Date(reminder.remindAt).toLocaleString("en-US", {
                month: "short",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}
            </span>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={onEdit}
              className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-app-hover-indigo transition-colors duration-200"
              aria-label="Edit note"
            >
              <span className="text-md">✏️</span>
            </button>

            <button
              type="button"
              onClick={onSetReminder}
              className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-app-hover-amber transition-colors duration-200"
              aria-label={reminder ? "Edit reminder" : "Set reminder"}
            >
              <span className="text-md">🔔</span>
            </button>

            {reminder && (
              <span className="text-xs text-app-slate-500">
                {new Date(reminder.remindAt).toLocaleString("en-US", {
                  month: "short",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
              </span>
            )}
          </>
        )}

        <button
          type="button"
          onClick={handleDelete}
          disabled={deleteNoteMutation.isPending}
          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-app-hover-rose transition-colors duration-200"
        >
          <span className="text-md">🗑</span>
        </button>
      </div>
    </div>
  );
}

export function NoteList({ jobId, notes }: NoteListProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [content, setContent] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [reminderNote, setReminderNote] = useState<Note | null>(null);

  const createNoteMutation = useCreateNote();
  const updateNoteMutation = useUpdateNote(jobId);

  const isPending =
    createNoteMutation.isPending || updateNoteMutation.isPending;

  const handleSave = () => {
    if (!content.trim()) return;

    if (editingNoteId) {
      updateNoteMutation.mutate(
        { noteId: editingNoteId, content: content.trim() },
        {
          onSuccess: () => {
            setContent("");
            setEditingNoteId(null);
          },
        },
      );
    } else {
      createNoteMutation.mutate(
        { jobId, content: content.trim() },
        {
          onSuccess: () => {
            setContent("");
            setIsCreating(false);
          },
        },
      );
    }
  };

  const handleCancel = () => {
    setContent("");
    setIsCreating(false);
    setEditingNoteId(null);
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">Notes</h3>

      {(isCreating || editingNoteId !== null) && (
        <div className="rounded-md border bg-app-bg-color p-3">
          <div className="flex items-start gap-3">
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              maxLength={5000}
              placeholder="Write a note..."
              rows={3}
              className="min-h-20 flex-1 resize-y rounded-md border border-slate-200 px-3 py-2 text-base text-app-slate-900 placeholder-app-slate-400 outline-none transition-all focus:border-app-indigo-500 focus:ring-2 focus:ring-app-indigo-500/20"
            />

            <div className="flex items-center gap-1.5 pt-2 shrink-0">
              <button
                type="button"
                onClick={handleSave}
                disabled={!content || isPending}
                className="flex h-8 w-8 items-center justify-center rounded-full text-app-emerald-400 hover:bg-app-hover-emerald transition-colors duration-200 disabled:opacity-50"
                aria-label="Save note"
              >
                <span className="text-md"> ✓ </span>
              </button>

              <button
                type="button"
                onClick={handleCancel}
                className="flex h-8 w-8 items-center justify-center rounded-full text-app-rose-600 hover:bg-app-hover-rose transition-colors duration-200"
                aria-label="Cancel"
              >
                <span className="text-md">✕</span>
              </button>
            </div>
          </div>

          <div className="mt-1 text-right text-xs text-muted-foreground">
            {content.length} / 5000
          </div>
        </div>
      )}

      {notes.length === 0 && !isCreating && (
        <p className="text-sm text-muted-foreground">No notes yet.</p>
      )}

      {notes.map((note) => {
        if (note.id === editingNoteId) return null;

        return (
          <NoteItem
            key={note.id}
            note={note}
            jobId={jobId}
            onEdit={() => {
              setContent(note.content);
              setEditingNoteId(note.id);
              setIsCreating(false);
            }}
            onSetReminder={() => setReminderNote(note)}
          />
        );
      })}

      {!isCreating && editingNoteId === null && (
        <button
          type="button"
          onClick={() => setIsCreating(true)}
          className="text-sm font-medium text-app-indigo-500 hover:text-app-indigo-700 transition-colors duration-200"
        >
          + Create Note
        </button>
      )}

      {reminderNote && (
        <ReminderDialog
          open={Boolean(reminderNote)}
          onOpenChange={(open) => {
            if (!open) setReminderNote(null);
          }}
          noteId={reminderNote.id}
        />
      )}
    </div>
  );
}

export default NoteList;
