import { Grid } from '@mui/material'
import { Api } from '../../api'
import { ExternalLoginRequest } from '../../api/ApiClient'
import { useToast } from '../../hooks/useToast'
import FacebookLogin from './FacebookLogin'
import GoogleLogin from './GoogleLogin'
type Props = {
  isLoggedIn: () => Promise<void>
}

const Login = ({ isLoggedIn: callback }: Props) => {
  const toast = useToast()
  const handleCallback = (provider: string) => async (token: string) => {
    try {
      await Api.externalLogin(provider, new ExternalLoginRequest({ token }))
      await callback()
    } catch (e: any) {
      toast.error(e.message)
    }
  }
  return (
    <>
      <GoogleLogin onResponse={handleCallback('google')} />
      <FacebookLogin onResponse={handleCallback('facebook')} />
    </>
  )
}

export default Login
