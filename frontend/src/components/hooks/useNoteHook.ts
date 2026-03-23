import { useCallback, useMemo, useState } from "react";
import { useNoteStore } from "../store/useNoteStore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { exportNoteAsDelta } from "../utils/exportNote";

interface UseNotesOptions {
  searchQuery?: string;
  filterBy?: "all" | "starred";
  sortBy?: "title" | "starred" | "recent";
}

export const useNotes = ({
  filterBy = "all",
  sortBy = "recent",
}: UseNotesOptions = {}) => {
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [newNoteImage, setNewNoteImage] = useState<File | null>(null);
  const [isCreatePopoverOpen, setIsCreatePopoverOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();
  const { notes, updateNote, deleteNote, createNote } = useNoteStore();

  const filteredNotes = useMemo(() => {
    const lowerQuery = searchQuery.toLowerCase();

    const filtered = notes.filter((note) => {
      if (filterBy === "starred" && !note.isStarred) return false;
      return !lowerQuery || note.title.toLowerCase().includes(lowerQuery);
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "starred":
          return (b.isStarred ? 1 : 0) - (a.isStarred ? 1 : 0);
        default:
          return (
            new Date(b.updatedAt ?? b.createdAt).getTime() -
            new Date(a.updatedAt ?? a.createdAt).getTime()
          );
      }
    });
  }, [notes, searchQuery, filterBy, sortBy]);

  const handleDelete = useCallback(
    (noteId: string) => {
      deleteNote(noteId);
    },
    [deleteNote],
  );

  const handleCreateNote = useCallback(async () => {
    if (!newNoteTitle.trim()) return toast.error("Title is required");
    if (!newNoteContent) return toast.error("Content is required");
    if (!newNoteImage) return toast.error("Thumbnail is required");

    try {
      await createNote({
        title: newNoteTitle.trim(),
        content: newNoteContent,
        thumbnail: newNoteImage,
      });

      setNewNoteTitle("");
      setNewNoteContent("");
      setNewNoteImage(null);

      setIsCreatePopoverOpen(false);
    } catch (err) {
      console.error(err);
    }
  }, [newNoteTitle, newNoteContent, newNoteImage, createNote]);

  const handleEdit = useCallback(
    (noteId: any) => {
      navigate(`/notes/${noteId._id}`);
    },
    [navigate],
  );

  const handleUpdate = useCallback(
    (noteId: string, data: Partial<(typeof notes)[0]>) => {
      updateNote(noteId, data);
    },
    [updateNote],
  );

  const handleExport = useCallback((notesToExport: typeof notes) => {
    exportNoteAsDelta(notesToExport);
  }, []);

  return {
    // State
    newNoteTitle,
    setNewNoteTitle,
    newNoteContent,
    setNewNoteContent,
    newNoteImage,
    setNewNoteImage,
    isCreatePopoverOpen,
    setIsCreatePopoverOpen,
    setSearchQuery,
    searchQuery,
    // Data
    notes,
    filteredNotes,
    // Handlers
    handleDelete,
    handleCreateNote,
    handleEdit,
    handleUpdate,
    handleExport,
  };
};

