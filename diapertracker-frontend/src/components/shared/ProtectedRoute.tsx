import React from 'react'
import { IUserProfile } from '../../api/ApiClient'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

interface Props {
  children?: React.ReactElement
  user: IUserProfile
}

const ProtectedRoute = ({ user, children }: Props) => {
  const location = useLocation()

  if (!user.isLoggedIn) {
    return (
      <Navigate
        to={{
          pathname: '/',
          search: `returnUrl=${encodeURIComponent(location.pathname)}`
        }}
        replace
      />
    )
  }

  return children ? children : <Outlet />
}

export default ProtectedRoute
