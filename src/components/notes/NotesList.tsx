import { useState, useEffect } from "react";

import { createNote, updateNote, deleteNote } from "@/api/notes";
import ReminderDialog from "../reminders/ReminderDialog";
import { getReminder, type Reminder } from "@/api/reminders";
import type { Note } from "@/types/note";

type NoteListProps = {
  jobId: string;
  notes: Note[];
  onCreated: () => void;
};

function NoteList({ jobId, notes, onCreated }: NoteListProps) {
  const [isCreating, setIsCreating] = useState(false);

  const [content, setContent] = useState("");

  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  const [reminderNoteId, setReminderNoteId] = useState<string | null>(null);

  const [reminders, setReminders] = useState<Record<string, Reminder | null>>(
    {},
  );

  const handleCreate = async () => {
    if (!content.trim()) {
      return;
    }

    await createNote({
      jobId,
      content: content.trim(),
    });

    setContent("");
    setIsCreating(false);
    onCreated();
  };

  const handleCancel = () => {
    setContent("");
    setIsCreating(false);
    setEditingNoteId(null);
  };

  const handleEdit = async (noteId: string) => {
    if (!content.trim()) {
      return;
    }

    await updateNote(noteId, content.trim());

    setContent("");
    setEditingNoteId(null);
    onCreated();
  };

  const handleDelete = async (noteId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this reminder?",
    );

    if (!confirmed) {
      return;
    }

    await deleteNote(noteId);

    onCreated();
  };

  useEffect(() => {
    const loadReminders = async () => {
      const results = await Promise.all(
        notes.map(async (note) => {
          const reminder = await getReminder(note.id);

          return [note.id, reminder] as const;
        }),
      );

      setReminders(Object.fromEntries(results));
    };

    if (notes.length > 0) {
      loadReminders();
    } else {
      setReminders({});
    }
  }, [notes]);

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">Notes</h3>

      {(isCreating || editingNoteId !== null) && (
        <div className="rounded-md border bg-background p-3">
          <div className="flex items-start gap-3">
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              maxLength={5000}
              placeholder="Write a note..."
              rows={3}
              className="min-h-20 flex-1 resize-y rounded-md border border-slate-200 px-3 py-2 text-base text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />

            <div className="flex items-center gap-1.5 pt-2 shrink-0">
              <button
                type="button"
                onClick={() =>
                  editingNoteId ? handleEdit(editingNoteId) : handleCreate()
                }
                className="flex h-8 w-8 items-center justify-center rounded-full text-[#34d399] hover:bg-[#34d399]/10 transition-colors duration-200"
                aria-label="Save note"
              >
                <span className="text-md"> ✓ </span>
              </button>

              <button
                type="button"
                onClick={handleCancel}
                className="flex h-8 w-8 items-center justify-center rounded-full text-rose-600 hover:bg-rose-50 transition-colors duration-200"
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
        if (note.id === editingNoteId) {
          return null;
        }
        return (
          <div
            key={note.id}
            className={`flex items-start justify-between gap-4 rounded-md border bg-background p-3 ${reminders[note.id]?.sentAt ? "opacity-60" : ""}`}
          >
            <div>
              <p className="text-sm">{note.content}</p>

              <p className="mt-2 text-xs text-muted-foreground">
                {new Date(note.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-1 pt-1">
              {reminders[note.id]?.sentAt ? (
                <>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#34d399]/10 px-2.5 py-1 text-sm font-medium text-[#10b981]">
                    ✓ Completed ·{" "}
                    {new Date(reminders[note.id]!.remindAt).toLocaleString(
                      "en-US",
                      {
                        month: "short",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      },
                    )}
                  </span>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setContent(note.content);
                      setEditingNoteId(note.id);
                      setIsCreating(false);
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[#4f46e5]/10 transition-colors duration-200"
                    aria-label="Edit note"
                  >
                    <span className="text-md">✏️</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setReminderNoteId(note.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[#d97706]/10 transition-colors duration-200"
                    aria-label={
                      reminders[note.id] ? "Edit reminder" : "Set reminder"
                    }
                  >
                    <span className="text-md">🔔</span>
                  </button>

                  {reminders[note.id] && (
                    <span className="text-xs text-slate-500">
                      {new Date(reminders[note.id]!.remindAt).toLocaleString(
                        "en-US",
                        {
                          month: "short",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        },
                      )}
                    </span>
                  )}
                </>
              )}

              <button
                type="button"
                onClick={() => handleDelete(note.id)}
                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-rose-50 transition-colors duration-200"
              >
                <span className="text-md">🗑</span>
              </button>
            </div>
          </div>
        );
      })}
      {!isCreating && editingNoteId === null && (
        <button
          type="button"
          onClick={() => setIsCreating(true)}
          className="text-sm font-medium text-indigo-500 hover:text-indigo-700 transition-colors duration-200"
        >
          + Create Note
        </button>
      )}
      <ReminderDialog
        open={reminderNoteId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setReminderNoteId(null);
          }
        }}
        noteId={reminderNoteId ?? ""}
        reminder={reminderNoteId ? reminders[reminderNoteId] : null}
        onCreated={async () => {
          if (!reminderNoteId) {
            return;
          }

          const reminder = await getReminder(reminderNoteId);

          setReminders((current) => ({
            ...current,
            [reminderNoteId]: reminder,
          }));

          setReminderNoteId(null);
        }}
      />
    </div>
  );
}

export default NoteList;
