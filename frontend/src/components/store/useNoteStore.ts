import { create } from 'zustand';
import { toast } from 'sonner';
import { axiosInstance } from '../utils/axios';

interface Note {
  _id: string;
  title: string;
  content: any;
  updatedAt: string;
  createdAt: string;
  thumbnail: File;
  owner: string;
  isStarred: boolean;
  color: string;
}

interface NoteStore {
  isCreatingNote: boolean;
  isNoteLoading: boolean;
  notes: Note[];
  note: Note | null;
  createNote: (data: Partial<Note>) => Promise<void>;
  getNotes: () => Promise<void>;
  updateNote: (id: string, data: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
}

export const useNoteStore = create<NoteStore>((set, get) => ({
  isCreatingNote: false,
  isNoteLoading: false,
  notes: [],
  note: null,

  createNote: async (data) => {
    if (!data || typeof data !== 'object' || !data.title?.trim()) {
      toast.error("Note must have a valid title");
      return;
    }

    set({ isCreatingNote: true });

    try {
      const res = await axiosInstance.post('/notes/create', data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const newNote = res.data.data;
      set({ notes: [newNote, ...get().notes] });
      console.log(newNote);
    } catch (error: any) {
      console.error("Create note error:", error);
      toast.error(error?.response?.data?.message || error?.message || "Note creation failed");
    } finally {
      set({ isCreatingNote: false });
    }
  },

  getNotes: async () => {
    set({ isNoteLoading: true });

    try {
      const res = await axiosInstance.get('/notes/get');
      const fetchedNotes = res.data.data;
      set({ notes: fetchedNotes });
    } catch (error: any) {
      console.error("Get notes error:", error);
      toast.error(error?.response?.data?.message || error?.message || "Note fetching failed");
    } finally {
      set({ isNoteLoading: false });
    }
  },

  getANote: async (id) => {
    set({ isNoteLoading: true });

    try {
      const res = await axiosInstance.get(`/notes/get/${id}`);
      const fetchedNote = res.data.data;
      set({ note: fetchedNote });
    } catch (error: any) {
      console.error("Get note error:", error);
      toast.error(error?.response?.data?.message || error?.message || "Note fetching failed");
    } finally {
      set({ isNoteLoading: false });
    }
  },

  updateNote: async (id, data) => {
    if (!id || typeof id !== "string") {
      toast.error("Invalid note ID");
      return;
    }

    if (!data || typeof data !== "object" || Object.keys(data).length === 0) {
      toast.error("Invalid update data");
      return;
    }

    const validFields = ['title', 'content', 'isStarred', 'color'];
    const hasValidFields = Object.keys(data).some(field => validFields.includes(field));
    if (!hasValidFields) {
      toast.error("Update contains invalid fields");
      return;
    }

    console.log(id, data);

    set({ isNoteLoading: true });

    try {
      const res = await axiosInstance.put(`/notes/update/${id}`, data);
      const updatedNote = res.data.data;


      set({
        notes: get().notes.map(note =>
          note._id === updatedNote._id ? { ...note, ...updatedNote } : note
        ),
        note: updatedNote,
      });

    } catch (error: any) {
      console.error("Update note error:", error);
      toast.error(error?.response?.data?.message || error?.message || "Note update failed");
    } finally {
      set({ isNoteLoading: false });
    }
  },

  deleteNote: async (id) => {
    if (!id || typeof id !== "string") {
      toast.error("Invalid note ID");
      return;
    }

    set({ isNoteLoading: true });

    try {
      await axiosInstance.delete(`/notes/delete/${id}`);
      set({ notes: get().notes.filter(note => note._id !== id) });
    } catch (error: any) {
      console.error("Delete note error:", error);
      toast.error(error?.response?.data?.message || error?.message || "Note deletion failed");
    } finally {
      set({ isNoteLoading: false });
    }
  },
}));
