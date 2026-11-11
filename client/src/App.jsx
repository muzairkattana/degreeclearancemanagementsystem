import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Layout from './components/Layout';

import LoginPage from './pages/LoginPage';
import StudentDashboard from './pages/StudentDashboard';
import ClearanceApplyPage from './pages/ClearanceApplyPage';
import OfficerDashboard from './pages/OfficerDashboard';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout>
          <Routes>
            {/* Public Route */}
            <Route path="/login" element={<LoginPage />} />

            {/* Student Routes */}
            <Route element={<ProtectedRoute allowedRoles={['student']} />}>
              <Route path="/student" element={<StudentDashboard />} />
              <Route path="/student/apply" element={<ClearanceApplyPage />} />
              <Route path="/student/applications" element={<StudentDashboard />} />
            </Route>

            {/* Officer Routes */}
            <Route element={<ProtectedRoute allowedRoles={['officer']} />}>
              <Route path="/officer" element={<OfficerDashboard />} />
            </Route>

            {/* Admin & Controller Routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin', 'controller']} />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/requests" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminDashboard />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  );
}
