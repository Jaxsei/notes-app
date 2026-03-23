type ExportableNote = {
  title: string;
  content: any;
  updatedAt: string;
  createdAt: string;
  owner: string;
  color: string,
  isStarred: boolean;
  _id: string;
};

function sanitizeFilename(name: unknown): string {
  if (typeof name !== "string" || !name.trim()) return "untitled_note";
  return name.trim().replace(/[^a-z0-9]/gi, "_").toLowerCase();
}

export function exportNoteAsDelta(
  note: ExportableNote,
  options?: {
    filename?: string;
    extension?: string; // default: '.delta.json'
  }
) {
  if (!note || typeof note !== "object") return;

  const {
    filename = sanitizeFilename(note.title),
    extension = ".delta.json",
  } = options || {};

  const deltaExport = {
    title: note.title,
    content: note.content,
    updatedAt: note.updatedAt,
    createdAt: note.createdAt,
    owner: note.owner,
    isStarred: note.isStarred,
    color: note.color,
    id: note._id,
  };

  const json = JSON.stringify(deltaExport, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}${extension}`;
  a.click();
  URL.revokeObjectURL(url);
}
