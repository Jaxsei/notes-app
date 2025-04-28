import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";  // ✅ Add BrowserRouter
import "./index.css";
import { ThemeProvider } from "./components/theme-provider";
import Navbar from "./components/sections/navbar/default.tsx";
import HomePage from "./components/home-page.tsx";
import NotesPage from "./components/notes-page.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>  {/* ✅ Wrap with BrowserRouter */}
      <ThemeProvider defaultTheme="light" storageKey="theme">
        <NotesPage />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
