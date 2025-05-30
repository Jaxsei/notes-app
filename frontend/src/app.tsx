import { useEffect } from "react";
import { useAuthStore } from "./components/store/useAuthStore";
import { Navigate, Route, Routes } from "react-router-dom";
import Cute404Page from "./components/pages/Cute404";
import { Loader } from "lucide-react";
import HomePage from "./components/pages/HomePage";
import SignupPage from "./components/pages/SignupPage";
import { LoginPage } from "./components/pages/LoginPage";
import SettingsPage from "./components/pages/SettingsPage";
import NotesPage from "./components/pages/NotesPage";
import NoteEditorPage from "./components/pages/NotesEditorPage";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();


  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({ authUser });

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (

    <Routes>
      <Route path="/" element={!authUser ? <HomePage /> : <Navigate to="/home" />} />
      <Route path="/home" element={authUser ? <NotesPage /> : <Navigate to="/login" />} />
      <Route path="/signup" element={!authUser ? <SignupPage /> : <Navigate to="/home" />} />
      <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/home" />} />
      <Route path="/settings" element={authUser ? <SettingsPage /> : <Navigate to="/login" />} />
      <Route path="/notes/:id" element={<NoteEditorPage />} />
      <Route path="/logout" element={<HomePage />} />
      <Route path="*" element={<Cute404Page />} />
    </Routes>
  );
}

export default App;
