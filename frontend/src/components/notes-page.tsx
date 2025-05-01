import { Search, Plus, FolderPlus, Upload, Star, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NuxtakeUI from "../components/logos/nuxtakeUI";
import { ModeToggle } from "../components/mode-toggle";

export default function NotesApp() {
  const logo = <NuxtakeUI className='w-12 h-12' />
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-truexl">
        {/* Header */}

        <header className="mb-[6rem] flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Logo + Title group */}
          <div className="flex items-center gap-2">
            {logo}
            <h1 className="text-5xl font-bold tracking-tight">Nuxtake</h1>
          </div>

          {/* Search bar + Mode toggle group */}
          <div className="flex items-center gap-2 w-full max-w-xs md:max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search notes..."
                className="pl-10"
              />
            </div>
            <ModeToggle />
          </div>
        </header>

        {/* Notes Section */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-3xl font-semibold tracking-tight">Notes</h2>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="outline" className="rounded-full">
                  <Plus className="h-5 w-5" />
                  <span className="sr-only">Add item</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem>
                  <Plus className="mr-2 h-4 w-4" />
                  Create note
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <FolderPlus className="mr-2 h-4 w-4" />
                  Create folder
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Upload className="mr-2 h-4 w-4" />
                  Import notes
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Notes Grid */}
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[
            { title: "The beginning of prototyping is the most important part", date: '2025-04-28', stared: true },
            { title: "13 Things You Should Give Up If You Want to Be a Successful UX Designer", date: '2025-04-28', stared: true },
            { title: "The Psychology Principles Every UI/UX Designer Needs to Know", date: '2025-04-28', stared: true },
            { title: "10 UI & UX Lessons from Building Medium's iPhone App", date: '2025-04-28', stared: true },
            { title: "52 Research Terms you need to know as a UX Designer", date: '2025-04-28', stared: true },
            { title: "Text fields & Forms design — UI components series", date: '2025-04-28', stared: true },
          ].map((note, index) => (
            <Card key={index} className="flex flex-col justify-between h-[240px] bg-muted">
              <CardHeader className="p-4">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-2xl font-bold leading-tight line-clamp-3">
                    {note.title}
                  </CardTitle>

                  <CardContent className="px-4 pb-4">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      {/* Show star if stared */}
                      {note.stared && (
                        <div>
                          <Star className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  </CardContent>

                </div>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  {/* Format the date to something cleaner */}
                  <span>{new Date(note.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  {/* Dropdown for More Options */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="text-muted-foreground">
                        <Pencil className="h-4 w-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Delete</DropdownMenuItem>
                      <DropdownMenuItem>Colour</DropdownMenuItem>
                      <DropdownMenuItem>Export Notes</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
