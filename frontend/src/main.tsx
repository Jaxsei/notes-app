import React from 'react';       // ✅ Import React separately
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { SignupForm } from './components/signup-form.tsx';
import './index.css';
import { LoginForm } from './components/login-form.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LoginForm />
    <SignupForm />
  </StrictMode>,
);
