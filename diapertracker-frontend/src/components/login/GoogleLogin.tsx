import { Google } from '@mui/icons-material'
import { useEffect, useState } from 'react'
import LoginButton from './LoginButton'
import { LoginStatus } from './LoginStatus'
import { LoginPayload } from './LoginPayload'

interface Props {
  onResponse: (status: LoginStatus, payload: LoginPayload) => Promise<void>
}

const GoogleLogin = ({ onResponse }: Props) => {
  const [client, setClient] = useState<google.accounts.oauth2.TokenClient>()
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    const script = document.getElementById('google-login-script')

    const initialize = () => {
      if (!window.google || initialized) return
      setInitialized(true)
      const tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID!,
        scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
        callback: (response) => {
          onResponse(LoginStatus.LoggedIn, { token: response.access_token })
        },
        error_callback(error) {
          onResponse(LoginStatus.Cancelled, { error: error.message })
        }
      })

      setClient(tokenClient)
    }

    script?.addEventListener('load', initialize)
    initialize()
  }, [initialized, onResponse])

  const onClick = () => {
    onResponse(LoginStatus.InProgress, {})
    client?.requestAccessToken()
  }

  if (!client) return null
  return (
    <>
      <LoginButton
        icon={<Google />}
        primaryColor="rgb(219,68,55)"
        secondaryColor="white"
        onClick={onClick}
      >
        Login with Google
      </LoginButton>
    </>
  )
}

export default GoogleLogin
