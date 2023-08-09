import { useCallback } from 'react'
import { Api } from '../../api'
import { ExternalLoginRequest } from '../../api/ApiClient'
import { useRequest } from '../../hooks/useRequest'
import GoogleLogin from './GoogleLogin'
import { LoginPayload } from './LoginPayload'
import { LoginStatus } from './LoginStatus'
type Props = {
  onChange: (status: LoginStatus) => Promise<void> | void
}

const Login = ({ onChange }: Props) => {
  const [, send] = useRequest()

  const handleCallback = useCallback(
    (provider: string) => async (status: LoginStatus, payload: LoginPayload) => {
      if (status !== LoginStatus.LoggedIn) {
        onChange(status)
        return
      }

      const { success } = await send(() =>
        Api.externalLogin(provider, new ExternalLoginRequest({ token: payload.token }))
      )

      if (success) {
        await onChange(status)
      }
    },
    [onChange, send]
  )
  return (
    <>
      <GoogleLogin onResponse={handleCallback('google')} />
      {/* facebook login requires business verification before it can go live :( */}
      {/* <FacebookLogin onResponse={handleCallback('facebook')} /> */}
    </>
  )
}

export default Login
