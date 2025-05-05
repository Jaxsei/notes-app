import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { ThemeProvider } from "./components/theme-provider";
import { AnimatedWrapper } from "./components/AnimatedWrapper.tsx";
import { SignupForm } from "./components/signup-form.tsx";
import { Toaster } from "react-hot-toast";
import { LoginForm } from "./components/login-form.tsx";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider defaultTheme="light" storageKey="theme">
        <AnimatedWrapper>
          <LoginForm />
          <Toaster position="top-right" />
        </AnimatedWrapper>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
