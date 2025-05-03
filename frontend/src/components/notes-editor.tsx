"use client"

import { useState } from "react"
import { ArrowLeft, Share2, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { format } from 'date-fns'
import { ModeToggle } from "./mode-toggle"

export default function NoteEditor() {
  const [noteTitle, setNoteTitle] = useState("Heading")
  const [noteContent, setNoteContent] = useState("")

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-10 bg-background">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon">
              <Share2 className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
            <ModeToggle />
          </div>
        </div>
        <div className="px-4 pb-2 text-sm text-muted-foreground">
          {format(new Date(), 'MMMM d, yyyy')} | Default Notebook
        </div>
        <Separator />
      </header>

      <main className="flex-1 p-4 space-y-4">
        <input
          value={noteTitle}
          onChange={(e) => setNoteTitle(e.target.value)}
          className="w-full bg-transparent text-2xl font-normal text-muted-foreground focus:outline-none"
          placeholder="Title"
        />
        <textarea
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
          className="w-full min-h-[calc(100vh-200px)] resize-none bg-transparent focus:outline-none"
          placeholder="Start writing..."
        />
      </main>

      <Separator />
    </div>
  )
}
