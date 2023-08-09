import {
  Alert,
  Button,
  Collapse,
  Grid,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography
} from '@mui/material'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Api } from '../api'
import { CreateTaskType, ProjectDto, ProjectMemberDto } from '../api/ApiClient'
import MemberList from '../components/members/MemberList'
import SendMemberInvite from '../components/members/SendMemberInvite'
import { ProjectFormUpdate } from '../components/project/ProjectForm'
import Loading from '../components/shared/Loading'
import TaskIcon from '../components/taskType/TaskIcon'
import { TaskTypeFormCreate } from '../components/taskType/TaskTypeForm'
import { useData } from '../hooks/useData'
import { useRequest } from '../hooks/useRequest'
import { useToast } from '../hooks/useToast'
import ErrorMessage from '../components/shared/ErrorMessage'

const getProject = async (id?: string) => (id ? Api.getProject(id) : undefined)
const getMembers = async (id?: string) => (id ? Api.getMembers(id) : [])
const ProjectSettingsPage = () => {
  const params = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [request, send] = useRequest()
  const toast = useToast()
  const [showCreateTaskType, setShowCreateTaskType] = useState(false)
  const [members] = useData(getMembers, params.id)
  const [project, refreshProject, updateProject] = useData(getProject, params.id)

  const handleTaskTypeCreated = async (taskType: CreateTaskType) => {
    setShowCreateTaskType(false)
    refreshProject()
  }

  const handleProjectUpdated = async (project: ProjectDto) => {
    await updateProject(project)
  }

  const deleteProject = async () => {
    if (!params.id) return
    const id = params.id
    const { success } = await send(() => Api.deleteProject(id))

    if (success) {
      toast.success('Project has been deleted')
      navigate(-1)
    }
  }
  if (!params.id) return null

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
        <Loading {...project}>
          {(data) => (
            <ProjectFormUpdate
              onUpdated={handleProjectUpdated}
              project={data}
            />
          )}
        </Loading>
      </Grid>
      <Grid
        item
        xs={11}
      >
        <Loading {...project}>
          {(data) => (
            <>
              <Typography variant="h6">Task Types</Typography>
              <Typography variant="body1">Below you can add new task types or invite new members</Typography>
              <List>
                {data.taskTypes.map((x) => (
                  <ListItemButton
                    key={x.id}
                    onClick={() => navigate(`/task-settings/${x.id}`)}
                  >
                    <ListItemIcon>
                      <TaskIcon name={x.icon} />
                    </ListItemIcon>
                    <ListItemText primary={x.displayName} />
                  </ListItemButton>
                ))}
              </List>
              {!data.taskTypes.length && (
                <Typography variant="body1">
                  You haven't setup any tasks yet. Add something you want to track for {data.name} by pressing 'Add'
                </Typography>
              )}
              {!showCreateTaskType && <Button onClick={() => setShowCreateTaskType(true)}>Add</Button>}

              <Collapse in={showCreateTaskType}>
                <TaskTypeFormCreate
                  projectId={data.id}
                  onCreated={handleTaskTypeCreated}
                  onCancel={() => setShowCreateTaskType(false)}
                />
              </Collapse>
            </>
          )}
        </Loading>
      </Grid>

      <Grid
        item
        xs={11}
      >
        <Loading {...members}>
          {(data) => (
            <>
              <Typography variant="h6">Administrators</Typography>
              <MemberList
                members={data}
                show="admins"
              />

              <Typography variant="h6">Members</Typography>
              <MemberList
                members={data}
                show="members"
              />

              {params.id && <SendMemberInvite projectId={params.id} />}

              <Typography variant="h6">Invites</Typography>
              <Alert severity="info">New feature coming soon - undo and view inprogress member invites</Alert>
            </>
          )}
        </Loading>
      </Grid>
      <Grid
        item
        xs={11}
      >
        <ErrorMessage error={request.error} />
        <Typography variant="h5">Danger Zone</Typography>
        <Alert severity="error">This operation can not be undone</Alert>
        <p></p>
        <Button
          onClick={deleteProject}
          color="error"
        >
          Delete
        </Button>
      </Grid>
    </Grid>
  )
}

export default ProjectSettingsPage
