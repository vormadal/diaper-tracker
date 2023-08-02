import { Grid, Typography } from '@mui/material'
import { Api } from '../api'
import { useData } from '../hooks/useData'
import Loading from '../components/shared/Loading'
import TaskList from '../components/task/TaskList'
import { useContext } from 'react'
import UserContext from '../contexts/UserContext'
import { TaskRecordDto } from '../api/ApiClient'
import { useNavigate } from 'react-router-dom'

function MyRegistrationsPage() {
  const [user] = useContext(UserContext)
  const [tasks] = useData(async (userId?: string) => Api.getTasks(undefined, undefined, 0, 50, userId), user.id)
  const navigate = useNavigate()
  const handleClick = (task: TaskRecordDto) => {
    navigate(`/registrations/${task.id}`)
  }
  return (
    <Grid
      container
      justifyContent="center"
    >
      <Grid
        item
        xs={11}
        md={6}
      >
        <Typography variant="h5">My Registrations</Typography>
        <Loading {...tasks}>
          {(data) => (
            <TaskList
              tasks={data}
              onClick={handleClick}
            />
          )}
        </Loading>
      </Grid>
    </Grid>
  )
}

export default MyRegistrationsPage
