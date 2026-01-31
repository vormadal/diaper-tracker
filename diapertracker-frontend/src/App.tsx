import { BabyChangingStationRounded } from '@mui/icons-material'
import { ThemeProvider } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { QueryClient, QueryClientProvider, useQuery, useQueryClient } from '@tanstack/react-query'
import { Loading, Navigation, ProtectedRoute, ToastProvider, Toaster, useToast } from '@vormadal/react-mui'
import { useEffect, useState } from 'react'
import { Route, HashRouter as Router, Routes, useNavigate, useSearchParams } from 'react-router-dom'
import { Api } from './api'
import { UserProfile } from './api/ApiClient'
import { LoginStatus } from './components/login/LoginStatus'
import { theme } from './config/Theme'
import UserContext from './contexts/UserContext'
import HomePage from './pages/HomePage'
import InvitationPage from './pages/InvitationPage'
import LandingPage from './pages/LandingPage'
import LogOutPage from './pages/LogoutPage'
import MyRegistrationsPage from './pages/MyRegistrationsPage'
import PrivacyPage from './pages/PrivacyPage'
import ProjectSettingsPage from './pages/ProjectSettingsPage'
import SettingsPage from './pages/SettingsPage'
import StatisticsPage from './pages/StatisticsPage'
import TaskRecordPage from './pages/TaskRecordPage'
import TaskTypeSettingsPage from './pages/TaskTypeSettingsPage'
import TermsPage from './pages/TermsPage'

const navbarPages = [
  {
    name: 'Home',
    path: '/'
  },
  {
    name: 'Registrations',
    path: '/registrations',
    protected: true
  },
  {
    name: 'Statistics',
    path: '/stats',
    protected: true
  },
  {
    name: 'Settings',
    path: '/settings',
    protected: true
  }
]
const avatarOptions = [
  {
    name: 'Log out',
    path: '/logout'
  }
]

const getMe = () => Api.me()
function App() {
  const queryClient = useQueryClient()
  const user = useQuery({ queryKey: ['me'], queryFn: getMe })
  const [loading, setLoading] = useState(false)
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const toast = useToast()

  useEffect(() => {
    if (user.error) {
      toast.error(user.error as string)
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
      queryClient.invalidateQueries({ queryKey: ['me'] })
    }
  }

  if (user.isLoading) return <Loading loading />

  return (
    <UserContext.Provider value={[user.data ?? new UserProfile(), () => {}]}>
      <>
        <Navigation
          Icon={({ sx }) => <BabyChangingStationRounded sx={sx} />}
          pages={navbarPages}
          isLoggedIn={user.data?.isLoggedIn}
          user={user.data}
          avatarOptions={avatarOptions}
          title="DiaperTracker"
        >
          <Toaster />
          <Loading
            data={user.data}
            error={user.error as string}
            loading={loading || user.isLoading}
            showReloads
          >
            {(data) => (
              <Routes>
                <Route
                  index
                  element={user.data?.isLoggedIn ? <HomePage /> : <LandingPage onLoginChange={handleLoginChange} />}
                />

                <Route element={<ProtectedRoute isLoggedIn={data?.isLoggedIn} />}>
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
                  <Route
                    path="logout"
                    element={<LogOutPage />}
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
        </Navigation>
      </>
    </UserContext.Provider>
  )
}

const queryClient = new QueryClient()

function AppWithProviders() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <ToastProvider>
          <ThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <App />
            </LocalizationProvider>
          </ThemeProvider>
        </ToastProvider>
      </Router>
    </QueryClientProvider>
  )
}

export default AppWithProviders
