import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { ThemeProvider } from "./components/utils/theme-provider";
import { Toaster } from "react-hot-toast";
import { LoginPage } from "./components/pages/LoginPage";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider defaultTheme="light" storageKey="theme">
        <LoginPage />
        <Toaster position="top-right" />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
