import { Button, Grid, Typography } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import Login from '../components/login/Login'
import { useData } from '../hooks/useData'
import { Api } from '../api'
import Loading from '../components/shared/Loading'
import { useContext, useState } from 'react'
import UserContext from '../contexts/UserContext'
import { useToast } from '../hooks/useToast'
import Spinner from '../components/shared/Spinner'

const InvitationPage = () => {
  const params = useParams<{ id: string }>()
  const toast = useToast()
  const navigate = useNavigate()
  const [invite] = useData(async (id) => (id ? Api.getInvite(id) : undefined), params.id)
  const [user, refreshUser] = useContext(UserContext)
  const [showLogin, setShowLogin] = useState(false)
  const [isLoading, setLoading] = useState(false)

  const acceptInvite = async (afterLogin: boolean) => {
    if (!params.id) return

    if (user.isLoggedIn || afterLogin) {
      setLoading(true)
      setShowLogin(false)
      refreshUser()
      await Api.acceptInvite(params.id)
      toast.success('Invite has been accepted')
      setLoading(false)
      navigate('/')
    } else {
      setShowLogin(true)
    }
  }

  const declineInvite = async () => {
    if (!params.id) return

    setLoading(true)
    await Api.declineInvite(params.id)
    toast.success('Invite has been declined')
    setLoading(false)
    navigate('/')
  }
  if (!params.id) return null
  return (
    <Grid
      container
      justifyContent="center"
    >
      <Grid
        item
        xs={11}
      >
        <Spinner show={isLoading} />
        {!isLoading && !showLogin && (
          <Loading {...invite}>
            {(data) => (
              <>
                <Typography variant="h5">Invite</Typography>

                {data.isAccepted && <Typography variant="body1">This invite has already been accepted</Typography>}
                {!data.isAccepted && (
                  <>
                    <Typography variant="body1">
                      You have been invited to contribute to "project" {data.project.name} by {data.createdBy.firstName}
                    </Typography>
                    <Button
                      color="success"
                      onClick={() => acceptInvite(false)}
                    >
                      Accept
                    </Button>
                    <Button
                      color="error"
                      onClick={() => declineInvite()}
                    >
                      Decline
                    </Button>
                  </>
                )}
              </>
            )}
          </Loading>
        )}

        {showLogin && (
          <>
            <Typography variant="body1">You need to login to accept the invite</Typography>
            <Login isLoggedIn={async () => acceptInvite(true)}></Login>
          </>
        )}
      </Grid>
    </Grid>
  )
}

export default InvitationPage
