import { Google } from '@mui/icons-material'
import { useEffect, useState } from 'react'
import LoginButton from './LoginButton'

type Props = {
  onResponse: (token: string) => Promise<void>
}

const GoogleLogin = ({ onResponse }: Props) => {
  const [client, setClient] = useState<google.accounts.oauth2.TokenClient>()

  useEffect(() => {
    const tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID!,
      scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
      callback: (response) => {
        onResponse(response.access_token)
      }
    })

    setClient(tokenClient)
  }, [])

  const onClick = () => {
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
