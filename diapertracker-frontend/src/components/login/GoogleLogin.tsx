import { useEffect } from 'react'

type Props = {
  onResponse: (token: string) => Promise<void>
}

const GoogleLogin = ({ onResponse }: Props) => {
  useEffect(() => {
    // this is a 'fake' div which will not be shown anywhere
    const div = window.document.getElementById('google_login')
    if (!div) {
      return
    }
    async function handleCredentialResponse(response: google.accounts.id.CredentialResponse) {
      onResponse(response.credential)
    }

    google.accounts.id.initialize({
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID!,
      callback: handleCredentialResponse
    })

    google.accounts.id.renderButton(
      div,
      {
        type: 'standard',
        shape: 'square',
        width: '100%',
        text: 'signin',
        theme: 'outline',
        size: 'large',
        logo_alignment: 'left'
      } // customization attributes
    )
  }, [])
  return (
    <>
      <div id="google_login"></div>
    </>
  )
}

export default GoogleLogin
