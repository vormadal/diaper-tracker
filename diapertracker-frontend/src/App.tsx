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

  if (!user.data?.isLoggedIn) {
    return <LandingPage onLogin={refreshUser} />
  }

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
                  element={<HomePage />}
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
