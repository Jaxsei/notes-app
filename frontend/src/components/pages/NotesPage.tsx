import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  Upload,
  FileText,
  Search,
  LayoutGrid,
  List,
  Bell,
  ChevronDown,
  ArrowUpDown,
  Menu,
  Loader,
} from "lucide-react";

import { useAuthStore } from "./../store/useAuthStore";
import { useNoteStore } from "./../store/useNoteStore";
import { itemVariants, containerVariants } from "../utils/animationVariants";
import { useNotes } from "../hooks/useNoteHook";
import {
  AvatarHolder,
  CreateModal,
  NoteCard,
  Sidebar,
} from "../services/NoteServices";

/* ─── Page ────────────────────────────────────────────────────────────────── */
export default function NotesPage() {
  const { logout, authUser } = useAuthStore();
  const { isNoteLoading, isCreatingNote, getNotes } = useNoteStore();
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("recent");
  const [filterBy, setFilterBy] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    getNotes();
  }, [getNotes]);

  const {
    newNoteTitle,
    setNewNoteTitle,
    newNoteContent,
    setNewNoteContent,
    newNoteImage,
    setNewNoteImage,
    filteredNotes,
    handleCreateNote,
    handleDelete,
    handleEdit,
    handleUpdate,
    handleExport,
    isCreatePopoverOpen,
    setIsCreatePopoverOpen,
    setSearchQuery,
    searchQuery,
  } = useNotes();

  const sorts = [
    { v: "recent", l: "Recent" },
    { v: "title", l: "Title" },
    { v: "starred", l: "Starred" },
  ];

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden p-2 gap-2 landscape:flex-row portrait:flex-col">
      {/* Portrait backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setSidebarOpen(false)}
            className="landscape:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`
        landscape:relative landscape:flex landscape:w-44 landscape:shrink-0 landscape:rounded-xl landscape:h-full landscape:overflow-hidden landscape:border landscape:border-border
        portrait:fixed portrait:top-0 portrait:left-0 portrait:h-full portrait:w-64 portrait:z-50 portrait:rounded-r-xl portrait:overflow-hidden portrait:border-r portrait:border-border
        portrait:transition-transform portrait:duration-200 portrait:ease-out
        ${sidebarOpen ? "portrait:translate-x-0" : "portrait:-translate-x-full"}
      `}
      >
        <Sidebar
          filterBy={filterBy}
          setFilterBy={(id) => {
            setFilterBy(id);
            setSidebarOpen(false);
          }}
          authUser={authUser}
          logout={logout}
          total={filteredNotes.length}
          onClose={() => setSidebarOpen(false)}
        />
      </aside>

      {/* Main */}
      <div className="flex flex-col flex-1 min-h-0 min-w-0 gap-2 p-2">
        {/* Topbar */}
        <header className="flex items-center gap-3 px-4 h-12 bg-card border border-border rounded-xl shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="landscape:hidden text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            <Menu size={16} />
          </button>

          <div className="relative flex-1 max-w-xs">
            <Search
              size={13}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes..."
              className="pl-8 h-8 text-xs bg-background border-border focus-visible:ring-1"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs gap-1.5 text-muted-foreground"
              >
                <ArrowUpDown size={11} />
                {sorts.find((s) => s.v === sortBy)?.l}
                <ChevronDown size={10} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {sorts.map((s) => (
                <DropdownMenuItem
                  key={s.v}
                  onClick={() => setSortBy(s.v)}
                  className={`text-xs cursor-pointer ${sortBy === s.v ? "font-semibold" : ""}`}
                >
                  {s.l}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex border border-border rounded-md overflow-hidden">
            {[
              { v: "grid", I: LayoutGrid },
              { v: "list", I: List },
            ].map(({ v, I }) => (
              <button
                key={v}
                onClick={() => setViewMode(v)}
                className={`px-2.5 py-1.5 transition-colors ${viewMode === v ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent/50"}`}
              >
                <I size={13} />
              </button>
            ))}
          </div>

          <Bell
            size={14}
            className="text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
          />
          <div className="w-7 h-7 rounded-full bg-muted border border-border flex items-center justify-center text-xs font-bold text-foreground shrink-0">
            {<AvatarHolder authUser={authUser} />}
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-card border border-border rounded-xl min-h-0">
          <div className="max-w-6xl mx-auto px-5 py-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-lg font-semibold tracking-tight">
                  My Notes
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {filteredNotes.length}{" "}
                  {filteredNotes.length === 1 ? "note" : "notes"}
                  {filteredNotes.filter((n) => n.isStarred).length > 0 &&
                    ` · ${filteredNotes.filter((n) => n.isStarred).length} starred`}
                  {filterBy !== "all" && (
                    <span className="ml-1.5 bg-muted px-1.5 py-0.5 rounded text-[10px] font-medium">
                      {filterBy}
                    </span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs gap-1.5 text-muted-foreground"
                >
                  <Upload size={11} />
                  Import
                </Button>
                <Button
                  size="sm"
                  className="h-8 text-xs gap-1.5"
                  onClick={() => setIsCreatePopoverOpen(true)}
                >
                  <Plus size={11} />
                  New note
                </Button>
              </div>
            </div>

            <Separator className="mb-6" />

            {isNoteLoading ? (
              <div className="flex flex-col items-center justify-center py-24 gap-3">
                <Loader
                  size={20}
                  className="animate-spin text-muted-foreground"
                />
                <p className="text-sm text-muted-foreground">
                  Loading your notes...
                </p>
              </div>
            ) : filteredNotes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
                <div className="w-12 h-12 rounded-xl border border-border bg-muted/30 flex items-center justify-center">
                  <FileText size={20} className="text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">
                    {searchQuery ? "No notes found" : "No notes yet"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {searchQuery
                      ? "Try a different search term"
                      : "Create your first note to get started"}
                  </p>
                </div>
                {!searchQuery && (
                  <Button
                    size="sm"
                    className="h-8 text-xs gap-1.5"
                    onClick={() => setIsCreatePopoverOpen(true)}
                  >
                    <Plus size={11} />
                    New note
                  </Button>
                )}
              </div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
                    : "flex flex-col gap-2"
                }
              >
                <AnimatePresence mode="popLayout">
                  {filteredNotes.map((note) => (
                    <motion.div
                      key={note._id}
                      variants={itemVariants}
                      layout
                      exit={{ opacity: 0, scale: 0.97 }}
                    >
                      <NoteCard
                        note={note}
                        viewMode={viewMode}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onExport={handleExport}
                        onToggleStar={(n) =>
                          handleUpdate(n._id, { isStarred: !n.isStarred })
                        }
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Create modal */}
      <AnimatePresence>
        {isCreatePopoverOpen && (
          <CreateModal
            open={isCreatePopoverOpen}
            onClose={() => setIsCreatePopoverOpen(false)}
            newNoteTitle={newNoteTitle}
            setNewNoteTitle={setNewNoteTitle}
            newNoteContent={newNoteContent}
            setNewNoteContent={setNewNoteContent}
            newNoteImage={newNoteImage}
            setNewNoteImage={setNewNoteImage}
            isCreatingNote={isCreatingNote}
            handleCreateNote={handleCreateNote}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

