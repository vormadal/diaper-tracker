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
import { useData } from '../hooks/useData'
import { useToast } from '../hooks/useToast'
import { TaskTypeFormCreate } from '../components/taskType/TaskTypeForm'

const ProjectSettingsPage = () => {
  const toast = useToast()
  const params = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [showCreateTaskType, setShowCreateTaskType] = useState(false)
  const [members] = useData<ProjectMemberDto[], string>(
    async (id?: string) => (id ? Api.getMembers(id) : []),
    params.id
  )
  const [project, , updateProject] = useData<ProjectDto, string>(
    async (id?: string) => (id ? Api.getProject(id) : undefined),
    params.id
  )

  const createTaskType = async (taskType: CreateTaskType) => {
    const created = await Api.createTaskType(taskType)
    toast.success(`${created.displayName} has been added`)
    updateProject()
    setShowCreateTaskType(false)
  }

  const handleProjectUpdated = async (project: ProjectDto) => {
    await updateProject(project)
  }

  if (!params.id) return null

  return (
    <Grid
      container
      justifyContent="center"
      spacing={4}
    >
      <Loading {...project}>
        {(data) => (
          <>
            <Grid
              item
              xs={11}
            >
              <ProjectFormUpdate
                onUpdated={handleProjectUpdated}
                project={data}
              />
            </Grid>
            <Grid
              item
              xs={11}
            >
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
                  onCreated={createTaskType}
                  onCancel={() => setShowCreateTaskType(false)}
                />
              </Collapse>
            </Grid>
          </>
        )}
      </Loading>

      <Loading {...members}>
        {(data) => (
          <Grid
            item
            xs={11}
          >
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
          </Grid>
        )}
      </Loading>
    </Grid>
  )
}

export default ProjectSettingsPage
