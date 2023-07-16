import { FacebookSharp as Facebook } from '@mui/icons-material'
import { useEffect, useState } from 'react'
import LoginButton from './LoginButton'

type Props = {
  onResponse: (token: string) => Promise<void>
}

const FacebookLogin = ({ onResponse }: Props) => {
  const [isLoaded, setLoaded] = useState(false)

  const onClick = () => {
    FB.login(
      (e: fb.StatusResponse) => {
        if (e.status === 'connected') {
          onResponse(e.authResponse.accessToken)
        }
      },
      {
        enable_profile_selector: true,
        scope: 'public_profile,email'
      }
    )
  }

  const initialize = () => {
    if (!window.FB) return
    FB.getLoginStatus(function (response) {
      if (response.status === 'connected') {
        onResponse(response.authResponse.accessToken)
      } else {
        setLoaded(true)
      }
    })
  }
  useEffect(() => {
    initialize()
  }, [])

  if (!isLoaded) {
    return null
  }

  return (
    <>
      <LoginButton
        primaryColor="rgb(60, 90, 154)"
        secondaryColor="white"
        icon={<Facebook />}
        onClick={onClick}
      >
        Login with Facebook
      </LoginButton>
    </>
  )
}

export default FacebookLogin
