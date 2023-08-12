import { ThemeProvider } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { useEffect, useState } from 'react'
import { Route, HashRouter as Router, Routes, useNavigate, useSearchParams } from 'react-router-dom'
import './App.css'
import { Api } from './api'
import { UserProfile } from './api/ApiClient'
import NavigationBar from './components/NavigationBar'
import { LoginStatus } from './components/login/LoginStatus'
import Loading from './components/shared/Loading'
import ProtectedRoute from './components/shared/ProtectedRoute'
import Spinner from './components/shared/Spinner'
import Toast from './components/shared/Toast'
import { theme } from './config/Theme'
import UserContext from './contexts/UserContext'
import { useData } from './hooks/useData'
import { useToast } from './hooks/useToast'
import HomePage from './pages/HomePage'
import InvitationPage from './pages/InvitationPage'
import LandingPage from './pages/LandingPage'
import MyRegistrationsPage from './pages/MyRegistrationsPage'
import PrivacyPage from './pages/PrivacyPage'
import ProjectSettingsPage from './pages/ProjectSettingsPage'
import SettingsPage from './pages/SettingsPage'
import TaskRecordPage from './pages/TaskRecordPage'
import TaskTypeSettingsPage from './pages/TaskTypeSettingsPage'
import TermsPage from './pages/TermsPage'
import StatisticsPage from './pages/StatisticsPage'

const getMe = () => Api.me()
function App() {
  const [user, refreshUser] = useData(getMe)
  const [loading, setLoading] = useState(false)
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const toast = useToast()

  useEffect(() => {
    if (user.error) {
      toast.error(user.error)
    }
  }, [user.error, toast])

  useEffect(() => {
    const returnUrl = params.get('returnUrl')
    if (user.data?.isLoggedIn && returnUrl) {
      navigate(decodeURIComponent(returnUrl))
    }
  }, [user.data?.isLoggedIn, navigate, params])

  const handleLoginChange = (status: LoginStatus) => {
    const isLoading = status === LoginStatus.InProgress
    setLoading(isLoading)
    if (!isLoading) {
      refreshUser()
    }
  }

  const handleLogout = async () => {
    if (user.data?.idp === 'facebook') {
      FB.logout(() => {
        Api.signout().then(refreshUser)
      })
    }
    if (user.data?.idp === 'google') {
      await Api.signout()
      await refreshUser()
    }
  }
  if (user.loading) return <Spinner />

  return (
    <UserContext.Provider value={[user.data ?? new UserProfile(), refreshUser]}>
      <>
        <NavigationBar handleLogout={handleLogout} />
        <Toast>
          <Loading
            {...user}
            loading={loading || user.loading}
            showReloads
          >
            {(data) => (
              <Routes>
                <Route
                  index
                  element={user.data?.isLoggedIn ? <HomePage /> : <LandingPage onLoginChange={handleLoginChange} />}
                />

                <Route element={<ProtectedRoute user={data} />}>
                  <Route
                    path="task-settings/:id"
                    element={<TaskTypeSettingsPage />}
                  />
                  <Route
                    path="settings/:id"
                    element={<ProjectSettingsPage />}
                  />
                  <Route
                    path="settings"
                    element={<SettingsPage />}
                  />
                  <Route
                    path="registrations/:id"
                    element={<TaskRecordPage />}
                  />
                  <Route
                    path="registrations"
                    element={<MyRegistrationsPage />}
                  />
                  <Route
                    path="stats"
                    element={<StatisticsPage />}
                  />
                </Route>
                <Route
                  path="privacy"
                  element={<PrivacyPage />}
                />
                <Route
                  path="terms"
                  element={<TermsPage />}
                />
                <Route
                  path="invite/:id"
                  element={<InvitationPage />}
                />
              </Routes>
            )}
          </Loading>
        </Toast>
      </>
    </UserContext.Provider>
  )
}

function AppWithProviders() {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <App />
        </LocalizationProvider>
      </ThemeProvider>
    </Router>
  )
}

export default AppWithProviders
