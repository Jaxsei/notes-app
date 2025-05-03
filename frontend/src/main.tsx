import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { ThemeProvider } from "./components/theme-provider";
import { AnimatedWrapper } from "./components/AnimatedWrapper.tsx";
import SettingsPage from "./components/settings.tsx";
import NoteEditor from "./components/notes-editor.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider defaultTheme="light" storageKey="theme">
        <AnimatedWrapper>
          <NoteEditor />
        </AnimatedWrapper>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
