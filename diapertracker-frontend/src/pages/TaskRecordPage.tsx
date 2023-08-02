import { useNavigate, useParams } from 'react-router-dom'
import { TaskRecordFormUpdate } from '../components/task/TaskRecordForm'
import { useData } from '../hooks/useData'
import { Api } from '../api'
import { Button, Grid, Typography } from '@mui/material'
import Loading from '../components/shared/Loading'
import TaskIcon from '../components/taskType/TaskIcon'
import { useState } from 'react'
import { useToast } from '../hooks/useToast'

interface Props {}

function TaskRecordPage({}: Props) {
  const params = useParams<{ id: string }>()
  const navigate = useNavigate()
  const toast = useToast()
  const [isDeleting, setDeleting] = useState(false)
  const [task] = useData(async (id) => (!id ? undefined : Api.getTask(id)), params.id)

  const handleUpdated = () => navigate(-1)
  const handleDelete = async () => {
    if (!params.id) return

    setDeleting(true)
    try {
      await Api.deleteTask(params.id)
      toast.success('Registration is deleted')
      navigate(-1)
    } finally {
      setDeleting(false)
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
          disabled={isDeleting}
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
