import {
  Badge,
  Calendar,
  Download,
  Edit3,
  FileText,
  Loader,
  LogOut,
  MoreHorizontal,
  Plus,
  Star,
  StickyNote,
  Trash2,
  X,
} from "lucide-react";
import NuxtakeUI from "../logos/nuxtakeUI";
import { useState } from "react";
import { deltaToText } from "../utils/deltaToText";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AlertDialogFooter, AlertDialogHeader } from "../ui/alert-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const NAV_ITEMS = [
  { id: "all", label: "All Notes", icon: StickyNote },
  { id: "starred", label: "Starred", icon: Star },
];

export const Sidebar = ({
  filterBy,
  setFilterBy,
  authUser,
  logout,
  total,
  onClose,
}) => {
  return (
    <div className="flex flex-col h-full w-full bg-card">
      <div className="flex items-center gap-2.5 px-4 h-12 border-b border-border shrink-0">
        <div className="w-7 h-7 rounded-md bg-foreground flex items-center justify-center shrink-0">
          <NuxtakeUI />
        </div>
        <span className="text-sm font-semibold tracking-tight text-foreground">
          Nuxtake
        </span>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto landscape:hidden text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <nav className="flex-1 p-2 space-y-0.5">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground px-2 pt-2 pb-1.5">
          Library
        </p>
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const active = filterBy === id;
          return (
            <button
              key={id}
              onClick={() => setFilterBy(id)}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors duration-100 ${
                active
                  ? "bg-accent text-accent-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              }`}
            >
              <Icon size={14} className="shrink-0" />
              <span className="flex-1 text-left truncate">{label}</span>
              {id === "all" && (
                <span className="text-[10px] font-semibold text-muted-foreground bg-muted px-1.5 py-0.5 rounded shrink-0">
                  {total}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-border p-3 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-muted border border-border flex items-center justify-center text-xs font-bold text-foreground shrink-0">
            {
              <div className="w-8 h-8 rounded-full bg-muted border border-border overflow-hidden shrink-0 flex items-center justify-center text-xs font-bold text-foreground">
                {<AvatarHolder authUser={authUser} />}
              </div>
            }
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground truncate">
              {authUser?.username ?? "User"}
            </p>
            <p className="text-[10px] text-muted-foreground truncate">
              {authUser?.email ?? ""}
            </p>
          </div>
          <button
            onClick={logout}
            className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            <LogOut size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};

// ------Avatar-----
export const AvatarHolder = ({ authUser }) => {
  return (
    <div className="w-8 h-8 rounded-full bg-muted border border-border overflow-hidden shrink-0 flex items-center justify-center text-xs font-bold text-foreground">
      {authUser?.avatar ? (
        <img
          src={authUser.avatar}
          alt=""
          className="w-full h-full object-cover"
        />
      ) : (
        (authUser?.username?.[0]?.toUpperCase() ?? "U")
      )}
    </div>
  );
};

/* ─── Note Card ───────────────────────────────────────────────────────────── */
export const NoteCard = ({
  note,
  viewMode,
  onEdit,
  onDelete,
  onExport,
  onToggleStar,
}) => {
  const preview = note.content ? deltaToText(note.content).slice(0, 80) : "";
  const dateStr = new Date(note.updatedAt ?? note.createdAt).toLocaleDateString(
    "en-US",
    { month: "short", day: "numeric", year: "numeric" },
  );
  const isList = viewMode === "list";
  const hasThumbnail = !isList && !!note.thumbnail;

  return (
    <div
      className={`group relative bg-card border border-border rounded-xl overflow-hidden transition-all duration-150 hover:shadow-md hover:border-border/60
        ${isList ? "flex flex-row" : "flex flex-col"}`}
    >
      {/* Thumbnail — taller now, info overlays on top */}
      {hasThumbnail ? (
        <div className="relative">
          <img
            src={note.thumbnail}
            alt=""
            className="w-full h-48 object-cover block"
          />

          {/* Gradient fade from image into card bg */}
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-card via-card/80 to-transparent" />

          {/* Info overlaid on gradient */}
          <div className="absolute inset-x-0 bottom-0 px-4 pb-3 pt-6">
            {/* Actions */}
            <div className="absolute top-2 right-2 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onToggleStar?.(note)}
                className="p-1 rounded hover:bg-black/30 transition-colors"
              >
                <Star
                  size={12}
                  className={
                    note.isStarred
                      ? "text-amber-400 fill-amber-400"
                      : "text-white/70"
                  }
                />
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-1 rounded hover:bg-black/30 transition-colors text-white/70">
                    <MoreHorizontal size={13} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[148px]">
                  <DropdownMenuItem
                    onClick={() => onEdit(note)}
                    className="text-xs cursor-pointer gap-2"
                  >
                    <Edit3 size={12} />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onExport(note)}
                    className="text-xs cursor-pointer gap-2"
                  >
                    <Download size={12} />
                    Export
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()}
                        className="text-xs cursor-pointer gap-2 text-destructive focus:text-destructive"
                      >
                        <Trash2 size={12} />
                        Delete
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete note?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDelete(note._id)}
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

            <h3
              onClick={() => onEdit(note)}
              className="text-sm font-semibold text-foreground truncate cursor-pointer hover:text-foreground/80 transition-colors mb-0.5"
            >
              {note.title || "Untitled"}
            </h3>
            {preview && (
              <p className="text-[11px] text-muted-foreground line-clamp-1 mb-1.5">
                {preview}
              </p>
            )}
            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
              <Calendar size={9} />
              {dateStr}
            </span>
          </div>
        </div>
      ) : (
        /* No thumbnail — normal layout */
        <div className="flex-1 min-w-0 p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3
              onClick={() => onEdit(note)}
              className="text-sm font-semibold text-foreground truncate cursor-pointer hover:text-foreground/80 transition-colors flex-1 min-w-0"
            >
              {note.title || "Untitled"}
            </h3>
            <div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onToggleStar?.(note)}
                className="p-1 rounded hover:bg-accent transition-colors"
              >
                <Star
                  size={12}
                  className={
                    note.isStarred
                      ? "text-amber-400 fill-amber-400"
                      : "text-muted-foreground"
                  }
                />
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-1 rounded hover:bg-accent transition-colors text-muted-foreground hover:text-foreground">
                    <MoreHorizontal size={13} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[148px]">
                  <DropdownMenuItem
                    onClick={() => onEdit(note)}
                    className="text-xs cursor-pointer gap-2"
                  >
                    <Edit3 size={12} />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onExport(note)}
                    className="text-xs cursor-pointer gap-2"
                  >
                    <Download size={12} />
                    Export
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()}
                        className="text-xs cursor-pointer gap-2 text-destructive focus:text-destructive"
                      >
                        <Trash2 size={12} />
                        Delete
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete note?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDelete(note._id)}
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
          </div>
          {preview && (
            <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">
              {preview}
            </p>
          )}
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
              <Calendar size={9} />
              {dateStr}
            </span>
            <div className="flex gap-1.5">
              {note.isStarred && (
                <Badge
                  variant="outline"
                  className="text-[9px] h-4 px-1.5 text-amber-400 border-amber-400/30"
                >
                  Starred
                </Badge>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── Create Modal ────────────────────────────────────────────────────────── */
export const CreateModal = ({
  open,
  onClose,
  newNoteTitle,
  setNewNoteTitle,
  newNoteContent,
  setNewNoteContent,
  newNoteImage,
  setNewNoteImage,
  isCreatingNote,
  handleCreateNote,
}) => {
  const handleSafeClose = () => {
    if (isCreatingNote) return;
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={handleSafeClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.18 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card border border-border rounded-xl w-full max-w-[460px] shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-start justify-between px-5 py-4 border-b border-border">
              <div>
                <h2 className="text-sm font-semibold text-foreground">
                  Create new note
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Add a title, content and optional thumbnail
                </p>
              </div>
              <button
                onClick={handleSafeClose}
                disabled={isCreatingNote}
                className={`text-muted-foreground hover:text-foreground transition-colors ${
                  isCreatingNote ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <X size={15} />
              </button>
            </div>

            {/* Body */}
            <div className="px-5 py-4 flex flex-col gap-4 max-h-[60vh] overflow-y-auto">
              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Title
                </label>
                <Input
                  placeholder="Give your note a title..."
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  disabled={isCreatingNote}
                  className="h-9 text-sm bg-background"
                />
              </div>

              {/* Content */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Content
                </label>
                <textarea
                  placeholder="Write your thoughts..."
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  disabled={isCreatingNote}
                  rows={5}
                  className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none leading-relaxed"
                />
              </div>

              {/* Thumbnail */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Thumbnail{" "}
                  <span className="text-muted-foreground font-normal">
                    (optional)
                  </span>
                </label>

                <Input
                  id="thumbnail"
                  type="file"
                  accept="image/*"
                  disabled={isCreatingNote}
                  onChange={(e) => setNewNoteImage(e.target.files?.[0] || null)}
                  className="h-9 text-sm bg-background cursor-pointer file:text-xs file:font-medium file:text-muted-foreground file:bg-transparent file:border-0"
                />

                {newNoteImage && (
                  <div className="flex items-center gap-2.5 px-3 py-2 bg-muted/50 border border-border rounded-md">
                    <FileText
                      size={13}
                      className="text-muted-foreground shrink-0"
                    />
                    <span className="text-xs text-foreground flex-1 truncate">
                      {newNoteImage.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground shrink-0">
                      {(newNoteImage.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                    <button
                      onClick={() => setNewNoteImage(null)}
                      disabled={isCreatingNote}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 px-5 py-3 border-t border-border bg-muted/20">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSafeClose}
                disabled={isCreatingNote}
                className="h-8 text-xs"
              >
                Cancel
              </Button>

              <Button
                size="sm"
                disabled={isCreatingNote || !newNoteTitle.trim()}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCreateNote({
                    title: newNoteTitle,
                    content: newNoteContent,
                    thumbnail: newNoteImage,
                  });
                }}
                className="h-8 text-xs gap-1.5"
              >
                {isCreatingNote ? (
                  <>
                    <Loader size={11} className="animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus size={11} />
                    Create note
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

