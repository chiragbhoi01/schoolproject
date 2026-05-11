import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { Suspense, lazy } from 'react'
import { useAppStore } from './store/appStore'
import ProtectedRoute from './routes/ProtectedRoute'
import MainLayout from './layouts/MainLayout'

// Pages
import LoginPage from './pages/auth/LoginPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import StudentsPage from './pages/students/StudentsPage'
import AttendancePage from './pages/attendance/AttendancePage'
import ActivitiesPage from './pages/activities/ActivitiesPage'
import ReportsPage from './pages/reports/ReportsPage'
import SettingsPage from './pages/settings/SettingsPage'

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
        <span className="text-sm text-gray-500">Loading...</span>
      </div>
    </div>
  )
}

export default function App() {
  const { darkMode } = useAppStore()

  return (
    <div className={darkMode ? 'dark' : ''}>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: '12px',
              background: '#fff',
              color: '#1f2937',
              boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
              fontSize: '13px',
              fontWeight: 500,
              padding: '12px 16px',
            },
            success: { iconTheme: { primary: '#2c694e', secondary: '#fff' } },
            error: { iconTheme: { primary: '#dc2626', secondary: '#fff' } },
          }}
        />
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Protected routes */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Suspense fallback={<PageLoader />}>
                    <Routes>
                      <Route path="/dashboard" element={<DashboardPage />} />
                      <Route path="/students" element={
                        <ProtectedRoute allowedRoles={['admin', 'teacher']}>
                          <StudentsPage />
                        </ProtectedRoute>
                      } />
                      <Route path="/attendance" element={<AttendancePage />} />
                      <Route path="/activities" element={<ActivitiesPage />} />
                      <Route path="/reports" element={
                        <ProtectedRoute allowedRoles={['admin', 'teacher']}>
                          <ReportsPage />
                        </ProtectedRoute>
                      } />
                      <Route path="/settings" element={<SettingsPage />} />
                      <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                  </Suspense>
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}
