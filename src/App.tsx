import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Incidents from "./pages/Incidents";
import AddIncident from "./pages/AddIncident";
import Analytics from "./pages/Analytics";
import SourcesManagement from "./pages/SourcesManagement";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import FirebaseInitializer from "./components/FirebaseInitializer";
import FirebaseStatus from "./components/FirebaseStatus";
import ErrorBoundary from "./components/ErrorBoundary";
import React, { useEffect, useState } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Import Firebase configuration to ensure it's initialized first
import { app } from "./integrations/firebase/config";

// Create a client
const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

// Admin route component
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, loading, isAdmin } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/dashboard" />;
  }
  
  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      {/* Protected routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/incidents" element={
        <ProtectedRoute>
          <Incidents />
        </ProtectedRoute>
      } />
      
      <Route path="/incidents/add" element={
        <ProtectedRoute>
          <AddIncident />
        </ProtectedRoute>
      } />
      
      <Route path="/analytics" element={
        <ProtectedRoute>
          <Analytics />
        </ProtectedRoute>
      } />
      
      {/* Admin routes */}
      <Route path="/admin" element={
        <AdminRoute>
          <Admin />
        </AdminRoute>
      } />
      
      <Route path="/admin/sources" element={
        <AdminRoute>
          <SourcesManagement />
        </AdminRoute>
      } />
      
      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  const [firebaseInitialized, setFirebaseInitialized] = useState(false);

  // Ensure Firebase is initialized before rendering the app
  useEffect(() => {
    if (app) {
      console.log("Firebase initialized successfully");
      setFirebaseInitialized(true);
    }
  }, []);

  if (!firebaseInitialized) {
    return <div className="min-h-screen flex items-center justify-center">Initializing Firebase...</div>;
  }

  return (
    <React.StrictMode>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <AuthProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <AppRoutes />
                <FirebaseStatus />
                <FirebaseInitializer />
              </BrowserRouter>
            </AuthProvider>
          </TooltipProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </React.StrictMode>
  );
}

export default App;
