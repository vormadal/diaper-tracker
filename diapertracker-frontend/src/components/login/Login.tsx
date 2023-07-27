import { Api } from '../../api'
import { ExternalLoginRequest } from '../../api/ApiClient'
import { useToast } from '../../hooks/useToast'
import GoogleLogin from './GoogleLogin'
import { LoginPayload } from './LoginPayload'
import { LoginStatus } from './LoginStatus'
type Props = {
  onChange: (status: LoginStatus) => Promise<void> | void
}

const Login = ({ onChange }: Props) => {
  const toast = useToast()
  const handleCallback = (provider: string) => async (status: LoginStatus, payload: LoginPayload) => {
    if (status !== LoginStatus.LoggedIn) {
      onChange(status)
      return
    }
    try {
      await Api.externalLogin(provider, new ExternalLoginRequest({ token: payload.token }))
      await onChange(status)
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
