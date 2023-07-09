import { ThemeProvider } from '@mui/material'
import { Route, HashRouter as Router, Routes } from 'react-router-dom'
import './App.css'
import Demo from './components/Demo'
import { theme } from './config/Theme'
import Toast from './components/Toast'
import { useData } from './hooks/useData'
import { Api } from './api'
import { useToast } from './hooks/useToast'
import { useEffect } from 'react'
import LoginPage from './pages/LoginPage'
import { UserProfile } from './api/ApiClient'
import UserContext from './contexts/UserContext'
import NavigationBar from './components/NavigationBar'

function App() {
  const [user, refreshUser] = useData(() => Api.me())
  const toast = useToast()
  useEffect(() => {
    if (user.error) {
      toast.error(user.error)
    }
  }, [user.error])

  const handleLogout = async () => {
    await Api.signout()
    await refreshUser()
  }
  if (user.loading) return null

  if (!user.data?.isLoggedIn) {
    return <LoginPage callback={refreshUser} />
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
                  element={<Demo />}
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
