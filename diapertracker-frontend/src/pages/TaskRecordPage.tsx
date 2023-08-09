import { Button, Grid, Typography } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { Api } from '../api'
import Loading from '../components/shared/Loading'
import { TaskRecordFormUpdate } from '../components/task/TaskRecordForm'
import TaskIcon from '../components/taskType/TaskIcon'
import { useData } from '../hooks/useData'
import { useRequest } from '../hooks/useRequest'
import { useToast } from '../hooks/useToast'

const getCurrentTask = async (id?: string) => (!id ? undefined : Api.getTask(id))
function TaskRecordPage() {
  const params = useParams<{ id: string }>()
  const navigate = useNavigate()
  const toast = useToast()
  const [task] = useData(getCurrentTask, params.id)
  const [request, send] = useRequest()

  const handleUpdated = () => navigate(-1)
  const handleDelete = async () => {
    if (!params.id) return

    const id = params.id
    const { success } = await send(() => Api.deleteTask(id))

    if (success) {
      toast.success('Registration is deleted')
      navigate(-1)
    }
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
        <Typography variant="h5">Registration</Typography>
        <Loading {...task}>
          {(data) => (
            <>
              <TaskIcon
                size="large"
                name={data.type.icon}
              />
              <TaskRecordFormUpdate
                taskRecord={data}
                onUpdated={handleUpdated}
              />
            </>
          )}
        </Loading>

        <Typography
          variant="h6"
          sx={{ mt: 2 }}
        >
          Danger Zone
        </Typography>
        <Typography variant="body1">This operation can not be undone</Typography>
        <Button
          disabled={request.loading}
          variant="contained"
          color="error"
          onClick={handleDelete}
        >
          Delete
        </Button>
      </Grid>
    </Grid>
  )
}

export default TaskRecordPage
