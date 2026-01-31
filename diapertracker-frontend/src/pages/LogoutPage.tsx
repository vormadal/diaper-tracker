import { Loading } from '@vormadal/react-mui'
import { useContext, useEffect } from 'react'
import UserContext from '../contexts/UserContext'
import { Api } from '../api'
import { useNavigate } from 'react-router-dom'

function LogOutPage() {
  const [user, refreshUser] = useContext(UserContext)
  const navigate = useNavigate()

  useEffect(() => {
    async function logout() {
      if (user.idp === 'facebook') {
        await new Promise<void>((resolve, reject) => {
          FB.logout(() => resolve())
        })
      }
      if (user.idp === 'google') {
        await Api.signout()
      }

      await refreshUser()
      navigate('/')
    }
    logout()
  }, [user.idp, refreshUser, navigate])

  return <Loading loading />
}

export default LogOutPage
