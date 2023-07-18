import {
  Button,
  Collapse,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography
} from '@mui/material'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Api } from '../api'
import { CreateTaskType, ProjectDto } from '../api/ApiClient'
import Loading from '../components/Loading'
import TaskIcon from '../components/TaskIcon'
import TaskTypeForm from '../components/taskType/TaskTypeForm'
import { useData } from '../hooks/useData'
import { useToast } from '../hooks/useToast'

const ProjectSettingsPage = () => {
  const toast = useToast()
  const params = useParams<{ id: string }>()
  const [project, updateProject] = useData<ProjectDto, string | undefined>(
    async (id?: string) => (id ? Api.getProject(id) : undefined),
    params.id
  )
  const [showCreateTaskType, setShowCreateTaskType] = useState(false)

  const createTaskType = async (taskType: CreateTaskType) => {
    const created = await Api.createTaskType(taskType)
    toast.success(`${created.displayName} has been added`)
    updateProject()
    setShowCreateTaskType(false)
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
        <Loading {...project}>
          {(data) => (
            <>
              <List>
                {data.taskTypes.map((x) => (
                  <ListItem key={x.id}>
                    <ListItemIcon>
                      <TaskIcon name={x.icon} />
                    </ListItemIcon>
                    <ListItemText primary={x.displayName} />
                  </ListItem>
                ))}
              </List>
              {!data.taskTypes.length && (
                <Typography variant="body1">
                  You haven't setup any tasks yet. Add something you want to track for {data.name} by pressing 'Add'
                  below
                </Typography>
              )}
              {!showCreateTaskType && <Button onClick={() => setShowCreateTaskType(true)}>Add</Button>}

              <Collapse in={showCreateTaskType}>
                <TaskTypeForm
                  projectId={data.id}
                  onSubmit={createTaskType}
                />
              </Collapse>
            </>
          )}
        </Loading>
      </Grid>
    </Grid>
  )
}

export default ProjectSettingsPage
