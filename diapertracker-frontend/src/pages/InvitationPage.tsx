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
import { useRequest } from '../hooks/useRequest'
import ErrorMessage from '../components/shared/ErrorMessage'

const getGivenInvite = async (id?: string) => (id ? Api.getInvite(id) : undefined)
const InvitationPage = () => {
  const params = useParams<{ id: string }>()
  const toast = useToast()
  const navigate = useNavigate()
  const [invite] = useData(getGivenInvite, params.id)
  const [user, refreshUser] = useContext(UserContext)
  const [showLogin, setShowLogin] = useState(false)
  const [request, send] = useRequest()

  const acceptInvite = async (afterLogin: boolean) => {
    if (!params.id) return

    if (user.isLoggedIn || afterLogin) {
      setShowLogin(false)
      refreshUser()
      const id = params.id
      const { success } = await send(() => Api.acceptInvite(id))
      if (success) {
        toast.success('Invite has been accepted')
      }
      navigate('/')
    } else {
      setShowLogin(true)
    }
  }

  const declineInvite = async () => {
    if (!params.id) return

    const id = params.id
    const { success } = await send(() => Api.declineInvite(id))

    if (success) {
      toast.success('Invite has been declined')
      navigate('/')
    }
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
        <ErrorMessage error={request.error} />
        <Spinner show={request.loading} />
        {!request.loading && !showLogin && (
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
            <Login onChange={async () => acceptInvite(true)}></Login>
          </>
        )}
      </Grid>
    </Grid>
  )
}

export default InvitationPage
