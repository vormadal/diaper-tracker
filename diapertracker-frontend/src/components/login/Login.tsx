import { Api } from '../../api'
import { ExternalLoginRequest } from '../../api/ApiClient'
import { useToast } from '../../hooks/useToast'
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
      {/* facebook login requires business verification before it can go live :( */}
      {/* <FacebookLogin onResponse={handleCallback('facebook')} /> */}
    </>
  )
}

export default Login
