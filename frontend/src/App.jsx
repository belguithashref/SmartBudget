import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Expenses from "./pages/Expenses";
import Income from "./pages/Income";
import Budgets from "./pages/Budgets";

import "./App.css";

import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

import { LanguageProvider } from "./context/LanguageContext.jsx";

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/register" replace />} />
          {/* Public pages */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Application layout */}
          <Route element={<Layout />}>
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/expenses"
              element={
                <ProtectedRoute>
                  <Expenses />
                </ProtectedRoute>
              }
            />

            <Route
              path="/income"
              element={
                <ProtectedRoute>
                  <Income />
                </ProtectedRoute>
              }
            />

            <Route
              path="/budgets"
              element={
                <ProtectedRoute>
                  <Budgets />
                </ProtectedRoute>
              }
            />

            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
