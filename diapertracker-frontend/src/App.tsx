import { ThemeProvider } from '@mui/material'
import { useEffect } from 'react'
import { Route, HashRouter as Router, Routes } from 'react-router-dom'
import './App.css'
import { Api } from './api'
import { UserProfile } from './api/ApiClient'
import NavigationBar from './components/NavigationBar'
import Toast from './components/Toast'
import { theme } from './config/Theme'
import UserContext from './contexts/UserContext'
import { useData } from './hooks/useData'
import { useToast } from './hooks/useToast'
import HomePage from './pages/HomePage'
import LandingPage from './pages/LandingPage'
import Spinner from './components/Spinner'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'
import SettingsPage from './pages/SettingsPage'
import ProjectSettingsPage from './pages/ProjectSettingsPage'

function App() {
  const [user, refreshUser] = useData(() => Api.me())
  const toast = useToast()
  useEffect(() => {
    if (user.error) {
      toast.error(user.error)
    }
  }, [user.error])

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
    <Router>
      <Toast>
        <UserContext.Provider value={[user.data ?? new UserProfile()]}>
          <ThemeProvider theme={theme}>
            <>
              <NavigationBar handleLogout={handleLogout} />
              <Routes>
                <Route
                  path="/"
                  element={user.data?.isLoggedIn ? <HomePage /> : <LandingPage onLogin={refreshUser} />}
                />
                <Route
                  path="privacy"
                  element={<PrivacyPage />}
                />
                <Route
                  path="terms"
                  element={<TermsPage />}
                />
                <Route
                  path="settings/:id"
                  element={<ProjectSettingsPage />}
                />
                <Route
                  path="settings"
                  element={<SettingsPage />}
                />
              </Routes>
            </>
          </ThemeProvider>
        </UserContext.Provider>
      </Toast>
    </Router>
  )
}

export default App
