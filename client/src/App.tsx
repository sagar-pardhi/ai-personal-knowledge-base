import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ProtectedRoute } from "./components/protected-route";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import DashboardPage from "./pages/dashboard";
import { Toaster } from "./components/ui/sonner";
import KbDetailsPage from "./pages/kb-details";

export function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/kbs/:id"
          element={
            <ProtectedRoute>
              <KbDetailsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
