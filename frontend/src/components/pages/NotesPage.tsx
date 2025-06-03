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
  FileText
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
    createNote({ title: newNoteTitle.trim(), content: newNoteContent });
    setNewNoteTitle("");
    setNewNoteContent('');
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
                    <PopoverContent className="w-80 sm:w-96 bg-background/95 backdrop-blur-sm border-border/50" align="end">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-4"
                      >
                        <div className="space-y-2">
                          <h4 className="font-semibold text-foreground">Create New Note</h4>
                          <p className="text-sm text-muted-foreground">
                            Add a title and content for your new note
                          </p>
                        </div>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Title</label>
                            <Input
                              placeholder="Enter note title..."
                              value={newNoteTitle}
                              onChange={(e) => setNewNoteTitle(e.target.value)}
                              className="bg-background border-border focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Content</label>
                            <Textarea
                              placeholder="Write your note content here..."
                              value={newNoteContent}
                              onChange={(e) => setNewNoteContent(e.target.value)}
                              className="bg-background border-border focus:border-primary focus:ring-1 focus:ring-primary min-h-[120px] resize-none"
                              rows={5}
                            />
                          </div>
                          <div className="flex justify-end gap-2 pt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setIsCreatePopoverOpen(false)}
                              className="bg-background hover:bg-accent"
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCreateNote({ title: newNoteTitle, content: setNewNoteContent })
                              }}
                              disabled={isCreatingNote || !newNoteTitle.trim()}
                              className="bg-primary hover:bg-primary/90 text-primary-foreground"
                            >
                              {isCreatingNote ? <Loader className="h-4 w-4 animate-spin" /> : "Create Note"}
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    </PopoverContent>
                  </Popover>
                </motion.div>
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
                            className={`
                          relative h-full overflow-hidden backdrop-blur-sm border-border/50
                          transition-all duration-300 hover:shadow-lg hover:shadow-primary/5
                          ${NOTE_COLORS.find(c => c.name === note.color)?.class || NOTE_COLORS[0].class}
                          hover:border-border
                        `}
                          >
                            {/* Subtle animated background pattern */}
                            <div className="absolute inset-0 opacity-5">
                              <div className="absolute inset-0 bg-gradient-to-br from-current via-transparent to-transparent"></div>
                            </div>

                            <CardHeader className="pb-2 sm:pb-3 relative z-10 flex-none p-3 sm:p-6">
                              <div className="flex items-start justify-between gap-2 sm:gap-3">
                                <CardTitle
                                  className="text-sm sm:text-base leading-snug line-clamp-2 sm:line-clamp-3 group-hover:text-primary transition-colors duration-200 cursor-pointer font-semibold"
                                  onClick={(e) => navigate(`/notes/${note._id}`)}
                                >
                                  {note.title}
                                </CardTitle>
                                <motion.div
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className={`h-6 w-6 sm:h-8 sm:w-8 shrink-0 transition-all duration-200 rounded-full ${note.isStarred
                                      ? "text-yellow-500 hover:text-yellow-600 bg-yellow-500/10"
                                      : "text-muted-foreground hover:text-yellow-500 hover:bg-yellow-500/10"
                                      }`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleUpdate(note._id, { isStarred: !note.isStarred });
                                    }}
                                  >
                                    <Star className={`h-3 w-3 sm:h-4 sm:w-4 transition-all duration-200 ${note.isStarred ? "fill-current scale-110" : ""}`} />
                                  </Button>
                                </motion.div>
                              </div>

                              {note.content?.ops && (
                                <motion.p
                                  className="text-xs sm:text-sm text-muted-foreground line-clamp-3 sm:line-clamp-4 mt-2 sm:mt-3 leading-relaxed"
                                  initial={{ opacity: 0.8 }}
                                  whileHover={{ opacity: 1 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  {deltaToText(note.content)
                                    .replace(/<[^>]*>/g, '')
                                    .slice(0, viewMode === "grid" ? 120 : 80)}...
                                </motion.p>
                              )}
                            </CardHeader>

                            <CardContent className="pt-0 relative z-10 flex-none mt-auto p-3 sm:p-6 sm:pt-0">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <motion.span
                                    className="inline-flex items-center gap-1 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full bg-muted/50 font-medium border border-border/30 text-xs"
                                    whileHover={{ scale: 1.05 }}
                                  >
                                    <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                    <span className="hidden sm:inline">
                                      {new Date(note.updatedAt || note.createdAt).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                      })}
                                    </span>
                                    <span className="sm:hidden">
                                      {new Date(note.updatedAt || note.createdAt).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                      })}
                                    </span>
                                  </motion.span>
                                </div>

                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <motion.div
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                    >
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 sm:h-8 sm:w-8 opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-full hover:bg-muted/50"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <MoreHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
                                      </Button>
                                    </motion.div>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent
                                    align="end"
                                    className="w-44 sm:w-48 bg-background/95 backdrop-blur-sm border-border/50"
                                  >
                                    <DropdownMenuItem
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleEdit(note._id);
                                      }}
                                      className="hover:bg-accent text-sm"
                                    >
                                      <Edit3 className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                                      Edit
                                    </DropdownMenuItem>

                                    <DropdownMenuSeparator className="bg-border/50" />

                                    <DropdownMenu>
                                      <DropdownMenuTrigger className="flex w-full items-center px-2 py-1.5 text-sm hover:bg-accent rounded-sm">
                                        <Palette className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                                        Change color
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent
                                        side="left"
                                        align="start"
                                        className="bg-background/95 backdrop-blur-sm border-border/50"
                                      >
                                        {NOTE_COLORS.map((color) => (
                                          <DropdownMenuItem
                                            key={color.name}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleUpdate(note._id, { color: color.name });
                                            }}
                                            className="hover:bg-accent text-sm"
                                          >
                                            <motion.div
                                              className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full mr-2 border ${color.class}`}
                                              whileHover={{ scale: 1.2 }}
                                              transition={{ duration: 0.1 }}
                                            />
                                            {color.name.charAt(0).toUpperCase() + color.name.slice(1)}
                                          </DropdownMenuItem>
                                        ))}
                                      </DropdownMenuContent>
                                    </DropdownMenu>

                                    <DropdownMenuItem
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleExport(note);
                                      }}
                                      className="hover:bg-accent text-sm"
                                    >
                                      <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                                      Export
                                    </DropdownMenuItem>

                                    <DropdownMenuSeparator className="bg-border/50" />

                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <DropdownMenuItem
                                          className="text-destructive focus:text-destructive hover:bg-destructive/10 text-sm"
                                          onSelect={(e) => e.preventDefault()}
                                        >
                                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                                          Delete
                                        </DropdownMenuItem>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent className="bg-background/95 backdrop-blur-sm border-border/50 mx-4 sm:mx-0">
                                        <AlertDialogHeader>
                                          <AlertDialogTitle className="text-base sm:text-lg">Delete Note</AlertDialogTitle>
                                          <AlertDialogDescription className="text-sm">
                                            Are you sure you want to delete "{note.title}"? This action cannot be undone.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                                          <AlertDialogCancel className="bg-background hover:bg-accent">Cancel</AlertDialogCancel>
                                          <AlertDialogAction
                                            onClick={() => handleDelete(note._id)}
                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
                          </Card>
                        </motion.div>
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
