import { useState, useEffect, useMemo, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ModeToggle } from "../utils/mode-toggle"
import Quill from 'react-quill'
import ReactQuill from "react-quill"
import {
  ArrowLeft,
  Share2,
  MoreVertical,
  Check,
  FilePenLine,
  Star,
  Trash2,
  Download,
  Save,
  Repeat
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


import { ProfilesIndicator } from "../sections/NotesHeader"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useNoteStore } from "../store/useNoteStore"
import { useAuthStore } from "../store/useAuthStore"
import { exportNoteAsDelta } from "../store/exportNote"
import { toast } from "sonner"

// Mock ReactQuill component with enhanced styling
const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "code"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    ["clean"]
  ]
};
const formats = [
  "header",
  "bold", "italic", "underline", "code",
  "list", "bullet",
  "link"
];



const formatDate = (date) => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatTime = (date) => {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}



export function AnimatedQuill({ value, onChange, className }) {
  const MemoizedQuill = useMemo(() => Quill, []); // Avoid SSR issues

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn("flex flex-col h-full", className)}
    >
      <MemoizedQuill
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder="Start writing your thoughts..."
        className="flex-1 rounded-lg bg-background/40 backdrop-blur-sm border-0"
        theme="snow"
      />
    </motion.div>
  );




} export default function NoteEditorPage() {
  const [noteTitle, setNoteTitle] = useState<any>("")
  const [noteContent, setNoteContent] = useState("Untitled note")
  const [saved, setSaved] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [autoSaving, setAutoSaving] = useState(false)

  const { note, getANote, updateNote, deleteNote, isNoteLoading } = useNoteStore();
  const { authUser } = useAuthStore();
  const { id } = useParams();


  const quillRef = useRef<ReactQuill>(null);
  const navigate = useNavigate();




  // Converts delta format into plaintext
  const getPlainText = () => {
    return quillRef.current?.getEditor().getText().trim() || "";
  };

  const plainText = getPlainText() || '';


  //Gets Data at startup
  useEffect(() => {
    getANote(id);
  }, [id]);
  useEffect(() => {
    if (note) {
      setNoteContent(note.content);
      setNoteTitle(note.title);
    }
  }, [note]);

  // autoSave function

  useEffect(() => {
    if (!autoSaving) return;

    const hasContent = plainText?.trim() || noteTitle.trim() !== "Untitled Note";
    if (!hasContent) return;

    const toastId = toast.loading("Auto-saving...");

    const timer = setTimeout(() => {
      handleUpdate(id, { title: noteTitle, content: noteContent });

      toast.success("Saved!", {
        id: toastId,
        description: "Your note has been updated.",
        duration: 2000,
      });

      setSaved(false);
    }, 5000);

    return () => {
      clearTimeout(timer);
      toast.dismiss(toastId); // prevent duplicate toasts on fast typing
    };
  }, [noteContent, noteTitle, autoSaving]);


  //Word count/ Not accurate
  useEffect(() => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;

    const handleTextChange = () => {
      const text = quill.getText(); // Plain visible text
      const wordCount = text
        .replace(/\n/g, " ") // replace newlines with spaces
        .trim()
        .split(/\s+/) // split by any whitespace
        .filter(word => word.length > 0).length;

      setWordCount(wordCount);
    };

    quill.on('text-change', handleTextChange);

    return () => {
      quill.off('text-change', handleTextChange);
    };
  }, []);


  //handle functions
  const handleSave = () => {
    setSaved(true)
    handleUpdate(id, { title: noteTitle, content: noteContent });
    setTimeout(() => setSaved(false), 2000)
  }

  const handleShare = () => {
    navigator.clipboard?.writeText(`${noteTitle}\n\n${noteContent}`)
  }

  const handleUpdate = useCallback((noteId, data) => {
    updateNote(noteId, data)
  }, [updateNote])

  // Event handlers
  const handleDelete = useCallback((id) => {
    deleteNote(id);
    navigate('/home')
  }, [deleteNote]);

  const handleExport = useCallback((note) => {
    exportNoteAsDelta(note)
  }, [note])





  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-20 -right-20 sm:-top-40 sm:-right-40 w-40 h-40 sm:w-80 sm:h-80 bg-gradient-to-br from-primary/5 to-accent/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-20 -left-20 sm:-bottom-40 sm:-left-40 w-48 h-48 sm:w-96 sm:h-96 bg-gradient-to-tr from-secondary/5 to-primary/5 rounded-full blur-3xl"
        />
      </div>

      {/* Top Bar */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-xl border-b border-border/50"
      >
        <div className="flex items-center justify-between px-3 sm:px-4 md:px-6 py-3 sm:py-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to='/home'>
              <Button variant="ghost" size="icon" className="hover:bg-accent/50 h-8 w-8 sm:h-10 sm:w-10">
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </Link>
          </motion.div>

          <div className="flex items-center gap-2 sm:gap-3">
            <AnimatePresence>
              {saved && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full"
                  />
                  Auto-saving...
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="icon"
                className={`h-7 w-7 sm:h-8 sm:w-8 shrink-0 transition-all duration-200 rounded-full ${note?.isStarred
                  ? "text-yellow-500 hover:text-yellow-600 bg-yellow-500/10"
                  : "text-muted-foreground hover:text-yellow-500 hover:bg-yellow-500/10"
                  }`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleUpdate(id, { isStarred: !note?.isStarred });
                }}
              >
                <Star className={`h-3 w-3 sm:h-4 sm:w-4 transition-all duration-200 ${note?.isStarred ? "fill-current scale-110" : ""}`} />
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button onClick={handleShare} variant="ghost" size="icon" className="hover:bg-accent/50 h-7 w-7 sm:h-8 sm:w-8">
                <Share2 className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </motion.div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="ghost" size="icon" className="hover:bg-accent/50 h-7 w-7 sm:h-8 sm:w-8">
                    <MoreVertical className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </motion.div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44 sm:w-47">
                <DropdownMenuItem onClick={handleSave} className="text-sm">
                  <Save className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  Save Note
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();
                  exportNoteAsDelta(note);
                }} className="text-sm">
                  <Download className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  Export
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();
                  setAutoSaving(!autoSaving)
                }} className="text-sm">
                  <Repeat className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  Auto Save
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive text-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(id)
                  }}
                >
                  <Trash2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="hidden sm:flex items-center gap-2 sm:gap-3">
              <ModeToggle />
              <ProfilesIndicator authUser={authUser} />
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="px-3 sm:px-4 md:px-6 pb-2 sm:pb-3 text-xs text-muted-foreground flex items-center justify-between"
        >
          <span className="truncate">{format(new Date(), "MMM d, yyyy")} · Personal</span>
          <span className="ml-2 shrink-0">{wordCount} words</span>
        </motion.div>
      </motion.header>

      {/* Editor Container */}
      <main className="flex-1 flex justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col w-full"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card/50 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-xl overflow-hidden"
          >
            {/* Header Section */}
            <div className="p-4 border-b border-border/50 bg-gradient-to-r from-background/50 to-muted/20">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-3 sm:mb-4 flex items-center gap-2 text-muted-foreground text-xs sm:text-sm"
              >
                <FilePenLine className="h-3 w-3 sm:h-4 sm:w-4" />
                Writing Note
              </motion.div>

              {/* Title Input */}
              <motion.input
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                placeholder="Enter your note title..."
                className="w-full bg-transparent text-xl sm:text-2xl md:text-3xl font-bold placeholder:text-muted-foreground/60 focus:outline-none focus:ring-0 text-foreground leading-tight"
              />
            </div>

            {/*
TODO: Make only editor textarea scrollable
Fix: The text stops appearing after a certain length

          */}

            {/* Editor Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col h-screen p-4"
            >
              <ReactQuill
                ref={quillRef}
                value={noteContent}
                onChange={(value, delta, source, editor) => {
                  setNoteContent(editor.getContents());
                }}
                className="flex-1 rounded-md [&_.ql-editor]:text-sm sm:[&_.ql-editor]:text-base [&_.ql-toolbar]:border-border/50 [&_.ql-container]:border-border/50"
              />
            </motion.div>
          </motion.div>

          {/* Status Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-muted-foreground px-2 gap-2 sm:gap-0"
          >
            <span>Last edited: {format(new Date(), "h:mm a")}</span>
            <div className="flex items-center gap-3 sm:gap-4">
              <span>{plainText.length} characters</span>
              <span className="hidden sm:inline">Auto-save: On</span>
            </div>
          </motion.div>

          {/* Mobile Bottom Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="sm:hidden fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-xl border-t border-border/50 p-3"
          >
            <div className="flex items-center justify-center gap-4">
              <ModeToggle />
              <ProfilesIndicator authUser={authUser} />
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}
