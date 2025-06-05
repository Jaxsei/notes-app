import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Star,
  Plus,
  Upload,
  MoreHorizontal,
  Edit3,
  Trash2,
  Palette,
  Download,
  Calendar,
  Loader,
  FileText,
  ThumbsUp,
  X
} from "lucide-react"; import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { NotesHeader } from "../sections/NotesHeader";
import toast from "react-hot-toast";
import { Textarea } from "../ui/textarea";
import { NotesSidebar } from "../sections/sidebar";




import { useAuthStore } from "./../store/useAuthStore";
import { useNoteStore } from "./../store/useNoteStore";
import { itemVariants, containerVariants, headerVariants, cardHoverVariants, sidebarVariants, floatingVariants, pulseVariants } from '../store/animationVariants'
import { NOTE_COLORS } from "../utils/note-colors";
import { deltaToText } from "../utils/deltaToText";
import { exportNoteAsDelta } from "../store/exportNote";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import { DialogHeader } from "../ui/dialog";


export default function NotesPage() {
  const navigate = useNavigate();
  const { logout, authUser } = useAuthStore();
  const {
    notes,
    isNoteLoading,
    isCreatingNote,
    deleteNote,
    getNotes,
    createNote,
    updateNote,
  } = useNoteStore();

  // State management
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState('')
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // grid | list
  const [sortBy, setSortBy] = useState("recent"); // recent | title | starred
  const [filterBy, setFilterBy] = useState("all"); // all | starred | folders
  const [newNoteImage, setNewNoteImage] = useState<File | null>(null);
  const [isCreatePopoverOpen, setIsCreatePopoverOpen] = useState(false);

  useEffect(() => {
    getNotes();
  }, [getNotes]);

  // Filtered and sorted notes
  const filteredNotes = notes
    .filter(note => {
      const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterBy === "all" ||
        (filterBy === "starred" && note.isStarred)
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "starred":
          return (b.isStarred ? 1 : 0) - (a.isStarred ? 1 : 0);
        default: // recent
          return new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt);
      }
    });

  // Event handlers
  const handleDelete = useCallback((noteId: string) => {
    deleteNote(noteId);
  }, [deleteNote]);

  const handleCreateNote = useCallback(() => {
    if (!newNoteTitle.trim()) return toast.error('Title is required');
    if (!newNoteContent) return toast.error('Content is required')
    if (!newNoteImage) return toast.error('Thumbnail is required')
    createNote({ title: newNoteTitle.trim(), content: newNoteContent, thumbnail: newNoteImage });
    setNewNoteTitle("");
    setNewNoteContent('');
    setNewNoteImage(null);
    setIsCreatePopoverOpen(false);
  }, [newNoteTitle, newNoteContent, createNote]);

  const handleEdit = useCallback((noteId: string) => {
    navigate(`/edit/${noteId}`);
  }, [navigate]);

  const handleUpdate = useCallback((noteId: string, data) => {
    updateNote(noteId, data)
  }, [updateNote])

  const handleExport = useCallback((notes) => {
    exportNoteAsDelta(notes)
  }, [notes])

  return (
    <div className="flex h-screen bg-gradient-to-br from-background via-background to-muted/20 text-foreground">
      <motion.div
        variants={sidebarVariants}
        initial="hidden"
        animate="show"
        className="relative hidden md:block"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        <NotesSidebar
          filterBy={filterBy}
          authUser={authUser}
          logout={logout}
          setFilterBy={setFilterBy}
        />
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Enhanced Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute -top-1/2 -right-1/2 w-48 h-48 md:w-96 md:h-96 bg-gradient-to-bl from-primary/10 via-transparent to-transparent rounded-full blur-3xl"
            variants={floatingVariants}
            animate="animate"
          />
          <motion.div
            className="absolute -bottom-1/2 -left-1/2 w-48 h-48 md:w-96 md:h-96 bg-gradient-to-tr from-secondary/10 via-transparent to-transparent rounded-full blur-3xl"
            variants={floatingVariants}
            animate="animate"
            style={{ animationDelay: '2s' }}
          />
          <motion.div
            className="absolute top-1/4 left-1/4 w-32 h-32 md:w-64 md:h-64 bg-gradient-to-r from-accent/5 via-transparent to-transparent rounded-full blur-2xl"
            variants={pulseVariants}
            animate="animate"
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-24 h-24 md:w-48 md:h-48 bg-gradient-to-l from-muted/20 via-transparent to-transparent rounded-full blur-xl"
            variants={pulseVariants}
            animate="animate"
            style={{ animationDelay: '1s' }}
          />
        </div>

        {/* Enhanced Header with animation */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate="show"
          className="relative z-10"
        >
          <NotesHeader
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sortBy={sortBy}
            setSortBy={setSortBy}
            viewMode={viewMode}
            setViewMode={setViewMode}
            authUser={authUser}
          />
        </motion.div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto relative z-10">
          <div className="p-6">
            <div className="max-w-full mx-auto">
              {/* Page Header with enhanced styling */}
              <motion.div
                className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 md:mb-8 gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="space-y-2">
                  <motion.h1
                    className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    My Notes
                  </motion.h1>
                  <motion.p
                    className="text-muted-foreground flex items-center gap-2 text-sm sm:text-base"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    <span className="inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 text-xs font-medium rounded-full bg-primary/10 text-primary">
                      {filteredNotes.length}
                    </span>
                    {filteredNotes.length === 1 ? 'note' : 'notes'}
                    {filterBy !== "all" && (
                      <span className="text-xs bg-secondary/50 px-2 py-1 rounded-full border border-border/50">
                        in {filterBy}
                      </span>
                    )}
                  </motion.p>
                </div>

                <motion.div
                  className="flex items-center gap-2 sm:gap-3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-background/80 backdrop-blur-sm border-border/50 hover:bg-accent hover:border-border transition-all duration-200 text-xs sm:text-sm"
                  >
                    <Upload className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Import</span>
                  </Button>


                  <Popover open={isCreatePopoverOpen} onOpenChange={setIsCreatePopoverOpen}>
                    <PopoverTrigger asChild>
                      <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 text-xs sm:text-sm">
                        <Plus className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                        <span className="hidden sm:inline">New Note</span>
                        <span className="sm:hidden">New</span>
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent
                      className="w-[90vw] max-w-[500px] bg-background/95 backdrop-blur-xl border border-border/50 shadow-2xl rounded-2xl p-0 overflow-hidden"
                      align="center"
                      side="bottom"
                      sideOffset={20}
                      style={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 50
                      }}
                    >
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="p-6 space-y-6 max-h-[80vh] overflow-y-auto"
                      >
                        {/* Header */}
                        <div className="space-y-3 pb-2 border-b border-border/30">
                          <h4 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                            Create New Note
                          </h4>
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            Transform your thoughts into organized notes with rich content and visual appeal.
                          </p>
                        </div>

                        <div className="space-y-5">
                          {/* Title Section */}
                          <div className="space-y-3">
                            <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-primary/60"></div>
                              Title
                            </label>
                            <Input
                              placeholder="Give your note a memorable title..."
                              value={newNoteTitle}
                              onChange={(e) => setNewNoteTitle(e.target.value)}
                              className="bg-background border-border/60 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 rounded-xl h-11 px-4 text-base placeholder:text-muted-foreground/60"
                            />
                          </div>

                          {/* Content Section */}
                          <div className="space-y-3">
                            <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-primary/60"></div>
                              Content
                            </label>
                            <Textarea
                              placeholder="Share your thoughts, ideas, or anything that inspires you..."
                              value={newNoteContent}
                              onChange={(e) => setNewNoteContent(e.target.value)}
                              className="bg-background border-border/60 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 rounded-xl min-h-[120px] resize-none px-4 py-3 text-base placeholder:text-muted-foreground/60 leading-relaxed"
                              rows={5}
                            />
                          </div>

                          {/* Thumbnail Section */}
                          <div className="space-y-3">
                            <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-primary/60"></div>
                              Thumbnail
                              <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
                            </label>

                            <div className="relative">
                              <Input
                                id='thumbnail'
                                name='thumbnail'
                                type="file"
                                accept="image/*"
                                onChange={(e) => setNewNoteImage(e.target.files?.[0] || null)}
                                className="bg-background border-border/60 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 rounded-xl h-11 px-4 file:bg-primary/10 file:text-primary file:border-0 file:rounded-lg file:px-3 file:py-1 file:text-sm file:font-medium file:mr-3 hover:file:bg-primary/20 file:transition-colors"
                              />
                              {newNoteImage && (
                                <motion.div
                                  initial={{ opacity: 0, y: 5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="mt-3 p-3 bg-primary/5 border border-primary/20 rounded-xl"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                                      <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                      </svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-foreground truncate">
                                        {newNoteImage.name}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {(newNoteImage.size / 1024 / 1024).toFixed(2)} MB
                                      </p>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => setNewNoteImage(null)}
                                      className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive rounded-lg"
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </motion.div>
                              )}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex justify-end gap-3 pt-4 border-t border-border/30">
                            <Button
                              variant="outline"
                              onClick={() => setIsCreatePopoverOpen(false)}
                              className="bg-background hover:bg-accent border-border/60 hover:border-border rounded-xl px-6 h-11 font-medium transition-all duration-200"
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCreateNote({
                                  title: newNoteTitle,
                                  content: newNoteContent,
                                  thumbnail: newNoteImage
                                });
                              }}
                              disabled={isCreatingNote || !newNoteTitle.trim()}
                              className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground shadow-lg hover:shadow-xl rounded-xl px-6 h-11 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isCreatingNote ? (
                                <div className="flex items-center gap-2">
                                  <Loader className="h-4 w-4 animate-spin" />
                                  <span>Creating...</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <Plus className="h-4 w-4" />
                                  <span>Create Note</span>
                                </div>
                              )}
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    </PopoverContent>
                  </Popover>                </motion.div>
              </motion.div>

              {/* Notes Grid/List */}
              {isNoteLoading ? (
                <motion.div
                  className="flex items-center justify-center py-12 sm:py-20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                      <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-4 border-muted border-t-primary"></div>
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-transparent animate-pulse"></div>
                    </div>
                    <p className="text-muted-foreground text-sm sm:text-base">Loading your notes...</p>
                  </div>
                </motion.div>
              ) : filteredNotes.length === 0 ? (
                <motion.div
                  className="text-center py-12 sm:py-20"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="max-w-md mx-auto space-y-4 sm:space-y-6 px-4">
                    <motion.div
                      className="w-16 h-16 sm:w-24 sm:h-24 mx-auto bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-primary/60" />
                    </motion.div>
                    <div className="space-y-2">
                      <h3 className="text-lg sm:text-xl font-semibold text-foreground">
                        {searchQuery ? "No notes found" : "Start your journey"}
                      </h3>
                      <p className="text-muted-foreground text-sm sm:text-base">
                        {searchQuery
                          ? "Try adjusting your search or filters"
                          : "Create your first note and begin organizing your thoughts"
                        }
                      </p>
                    </div>
                    {!searchQuery && (
                      <Button
                        onClick={() => setIsCreatePopoverOpen(true)}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create Your First Note
                      </Button>
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  className={viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 auto-rows-max"
                    : "space-y-2 sm:space-y-3"
                  }
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                >
                  <AnimatePresence mode="popLayout">
                    {filteredNotes.map((note, index) => (
                      <motion.div
                        key={note._id}
                        variants={itemVariants}
                        exit="exit"
                        layout
                        layoutId={note._id}
                        style={{
                          animationDelay: `${index * 0.05}s`
                        }}
                      >
                        <motion.div
                          variants={cardHoverVariants}
                          initial="rest"
                          whileHover="hover"
                          className="group cursor-pointer h-full"
                        >
                          <Card
                            key={note._id}
                            className={`
        group relative h-full overflow-hidden backdrop-blur-md border border-border/30
        transition-all duration-500 ease-out
        hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2
        ${NOTE_COLORS.find(c => c.name === note.color)?.class || NOTE_COLORS[0].class}
        hover:border-primary/30
        flex flex-col
        bg-gradient-to-br from-background/95 to-background/80
        before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/5 before:to-transparent before:opacity-0 before:transition-opacity before:duration-300
        hover:before:opacity-100
      `}
                          >
                            {/* Thumbnail Section - Enhanced */}
                            {note?.thumbnail ? (
                              <div className="relative w-full h-36 flex-shrink-0 overflow-hidden">
                                <img
                                  src={note.thumbnail}
                                  alt="Note cover"
                                  className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:brightness-110"
                                  loading="lazy"
                                />

                                {/* Elegant overlay gradients */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-70 group-hover:opacity-50 transition-opacity duration-300" />
                                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background via-background/80 to-transparent" />

                                {/* Decorative corner accent */}
                                <div className="absolute top-3 right-3 w-8 h-8 bg-gradient-to-br from-white/20 to-white/5 rounded-full backdrop-blur-sm border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0" />
                              </div>
                            ) : (
                              // Beautiful pattern background for notes without thumbnails
                              <div className="relative w-full h-36 flex-shrink-0 overflow-hidden bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5">
                                <div className="absolute inset-0 opacity-30">
                                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)]" />
                                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,119,198,0.1),transparent_50%)]" />
                                  <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,rgba(255,255,255,0.05)_60deg,transparent_120deg)]" />
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background via-background/80 to-transparent" />
                              </div>
                            )}

                            {/* Header Section - Enhanced */}
                            <CardHeader className="relative z-10 flex-shrink-0 p-4 pb-2">
                              <div className="flex items-start justify-between gap-3">
                                <CardTitle
                                  className="text-base font-bold leading-tight line-clamp-2 group-hover:text-primary transition-all duration-300 cursor-pointer transform group-hover:translate-x-1"
                                  onClick={(e) => navigate(`/notes/${note._id}`)}
                                >
                                  {note.title}
                                </CardTitle>

                                {/* Enhanced star button */}
                                <motion.div
                                  whileHover={{ scale: 1.15, rotate: 10 }}
                                  whileTap={{ scale: 0.9 }}
                                  className="flex-shrink-0"
                                >
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className={`h-8 w-8 rounded-full transition-all duration-300 ${note.isStarred
                                      ? "text-amber-500 bg-amber-500/15 hover:bg-amber-500/25 shadow-lg shadow-amber-500/20"
                                      : "text-muted-foreground hover:text-amber-500 hover:bg-amber-500/10"
                                      }`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleUpdate(note._id, { isStarred: !note.isStarred });
                                    }}
                                  >
                                    <Star
                                      className={`h-4 w-4 transition-all duration-300 ${note.isStarred ? "fill-current drop-shadow-sm" : ""
                                        }`}
                                    />
                                  </Button>
                                </motion.div>
                              </div>

                              {/* Content preview with better typography */}
                              {note.content?.ops && (
                                <motion.p
                                  className="text-sm text-muted-foreground/80 line-clamp-3 mt-3 leading-relaxed font-medium"
                                  initial={{ opacity: 0.7 }}
                                  whileHover={{ opacity: 1 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  {deltaToText(note.content)
                                    .replace(/<[^>]*>/g, '')
                                    .slice(0, viewMode === "grid" ? 120 : 80)}...
                                </motion.p>
                              )}
                            </CardHeader>

                            {/* Footer Section - Enhanced */}
                            <CardContent className="relative z-10 flex-grow flex flex-col justify-end p-4 pt-0">
                              <div className="flex items-center justify-between">
                                {/* Beautiful date badge */}
                                <motion.div
                                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-muted/80 to-muted/60 backdrop-blur-sm border border-border/50 shadow-sm"
                                  whileHover={{ scale: 1.05, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <Calendar className="w-3.5 h-3.5 text-primary/70" />
                                  <span className="text-xs font-medium text-foreground/80">
                                    {new Date(note.updatedAt || note.createdAt).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    })}
                                  </span>
                                </motion.div>

                                {/* Enhanced dropdown menu */}
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <motion.div
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                    >
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-full hover:bg-muted/60 backdrop-blur-sm border border-border/30 hover:border-border/50"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </motion.div>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent
                                    align="end"
                                    className="w-48 bg-background/95 backdrop-blur-xl border-border/50 shadow-xl rounded-xl p-1"
                                  >
                                    <DropdownMenuItem
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleEdit(note._id);
                                      }}
                                      className="hover:bg-accent/80 rounded-lg transition-colors duration-200 cursor-pointer"
                                    >
                                      <Edit3 className="h-4 w-4 mr-3 text-primary/70" />
                                      <span className="font-medium">Edit</span>
                                    </DropdownMenuItem>

                                    <DropdownMenuSeparator className="bg-border/30 my-1" />

                                    <DropdownMenu>
                                      <DropdownMenuTrigger className="flex w-full items-center px-2 py-2 text-sm hover:bg-accent/80 rounded-lg transition-colors duration-200 cursor-pointer">
                                        <Palette className="h-4 w-4 mr-3 text-primary/70" />
                                        <span className="font-medium">Change color</span>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent
                                        side="left"
                                        align="start"
                                        className="bg-background/95 backdrop-blur-xl border-border/50 shadow-xl rounded-xl p-1"
                                      >
                                        {NOTE_COLORS.map((color) => (
                                          <DropdownMenuItem
                                            key={color.name}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleUpdate(note._id, { color: color.name });
                                            }}
                                            className="hover:bg-accent/80 rounded-lg transition-colors duration-200 cursor-pointer"
                                          >
                                            <motion.div
                                              className={`w-4 h-4 rounded-full mr-3 border-2 border-white/20 shadow-sm ${color.class}`}
                                              whileHover={{ scale: 1.2 }}
                                              transition={{ duration: 0.15 }}
                                            />
                                            <span className="font-medium">
                                              {color.name.charAt(0).toUpperCase() + color.name.slice(1)}
                                            </span>
                                          </DropdownMenuItem>
                                        ))}
                                      </DropdownMenuContent>
                                    </DropdownMenu>

                                    <DropdownMenuItem
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleExport(note);
                                      }}
                                      className="hover:bg-accent/80 rounded-lg transition-colors duration-200 cursor-pointer"
                                    >
                                      <Download className="h-4 w-4 mr-3 text-primary/70" />
                                      <span className="font-medium">Export</span>
                                    </DropdownMenuItem>

                                    <DropdownMenuSeparator className="bg-border/30 my-1" />

                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <DropdownMenuItem
                                          className="text-destructive focus:text-destructive hover:bg-destructive/10 rounded-lg transition-colors duration-200 cursor-pointer font-medium"
                                          onSelect={(e) => e.preventDefault()}
                                        >
                                          <Trash2 className="h-4 w-4 mr-3" />
                                          Delete
                                        </DropdownMenuItem>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent className="bg-background/95 backdrop-blur-xl border-border/50 mx-4 sm:mx-0 rounded-2xl shadow-2xl">
                                        <AlertDialogHeader>
                                          <AlertDialogTitle className="text-lg font-bold">Delete Note</AlertDialogTitle>
                                          <AlertDialogDescription className="text-muted-foreground">
                                            Are you sure you want to delete "{note.title}"? This action cannot be undone.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                                          <AlertDialogCancel className="bg-background hover:bg-accent rounded-xl font-medium">
                                            Cancel
                                          </AlertDialogCancel>
                                          <AlertDialogAction
                                            onClick={() => handleDelete(note._id)}
                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl font-medium shadow-lg"
                                          >
                                            Delete
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </CardContent>

                            {/* Subtle animation line at bottom */}
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          </Card>                        </motion.div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
