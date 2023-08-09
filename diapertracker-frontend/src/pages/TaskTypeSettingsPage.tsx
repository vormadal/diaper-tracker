import { Alert, Button, Grid, Typography } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { Api } from '../api'
import Loading from '../components/shared/Loading'
import { TaskTypeFormUpdate } from '../components/taskType/TaskTypeForm'
import { useData } from '../hooks/useData'
import { useRequest } from '../hooks/useRequest'
import { useToast } from '../hooks/useToast'

type ParamsType = {
  id: string
}

const getTaskType = async (id?: string) => (id ? Api.getTaskType(id) : undefined)

const TaskTypeSettingsPage = () => {
  const params = useParams<ParamsType>()
  const [taskType] = useData(getTaskType, params.id)
  const toast = useToast()
  const [, send] = useRequest()
  const navigate = useNavigate()

  const deleteTaskType = async () => {
    if (!params.id) return

    const id = params.id
    const { success } = await send(() => Api.deleteTaskType(id))
    if (success) {
      toast.success('Task type has been deleted')
      navigate(-1)
    }
  }
  return (
    <Grid
      container
      justifyContent="center"
      spacing={4}
    >
      <Grid
        item
        xs={11}
      >
        <Loading {...taskType}>{(data) => <TaskTypeFormUpdate taskType={data} />}</Loading>
      </Grid>
      <Grid
        item
        xs={11}
      >
        <Typography variant="h5">Danger Zone</Typography>
        <Alert severity="error">This operation can not be undone</Alert>
        <p></p>
        <Button
          onClick={deleteTaskType}
          color="error"
        >
          Delete
        </Button>
      </Grid>
    </Grid>
  )
}

export default TaskTypeSettingsPage
