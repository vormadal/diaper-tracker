import { FacebookSharp as Facebook } from '@mui/icons-material'
import { Button } from '@mui/material'
import { useEffect } from 'react'

type Props = {
  onResponse: (token: string) => Promise<void>
}

const FacebookLogin = ({ onResponse }: Props) => {
  const onClick = () => {
    FB.login(
      (e: fb.StatusResponse) => {
        if (e.status === 'connected') {
          onResponse(e.authResponse.accessToken)
        }
      },
      {
        enable_profile_selector: true,
        scope: 'email,public_profile'
      }
    )
  }

  useEffect(() => {
    FB.init({
      version: 'v17.0',
      appId: process.env.REACT_APP_FB_APP_ID,
      status: true,
      xfbml: true
    })
  }, [])

  return (
    <>
      <Button
        startIcon={<Facebook />}
        fullWidth
        sx={{
          color: 'rgb(60, 90, 154)',
          borderColor: 'rgb(60, 90, 154)',
          backgroundColor: 'white',
          ':hover': {
            color: 'white',
            backgroundColor: 'rgb(60, 90, 154)'
          }
        }}
        onClick={onClick}
      >
        Login with Facebook
      </Button>
    </>
  )
}

export default FacebookLogin
