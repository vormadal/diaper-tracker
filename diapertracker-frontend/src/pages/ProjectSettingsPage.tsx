import { Delete, Edit, Save } from '@mui/icons-material'
import {
  Button,
  Collapse,
  Grid,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography
} from '@mui/material'
import { FormEvent, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Api } from '../api'
import { CreateProjectMemberInviteDto, CreateTaskType, ProjectDto, ProjectMemberDto } from '../api/ApiClient'
import Loading from '../components/Loading'
import TaskIcon from '../components/TaskIcon'
import TaskTypeForm from '../components/taskType/TaskTypeForm'
import { useData } from '../hooks/useData'
import { useToast } from '../hooks/useToast'

const ProjectSettingsPage = () => {
  const toast = useToast()
  const params = useParams<{ id: string }>()
  const [email, setEmail] = useState('')
  const [members, updateMembers] = useData<ProjectMemberDto[], string>(
    async (id?: string) => (id ? Api.getMembers(id) : []),
    params.id
  )
  const [project, updateProject] = useData<ProjectDto, string>(
    async (id?: string) => (id ? Api.getProject(id) : undefined),
    params.id
  )
  const [showCreateTaskType, setShowCreateTaskType] = useState(false)
  const [showInviteMember, setShowInviteMember] = useState(false)

  const createTaskType = async (taskType: CreateTaskType) => {
    const created = await Api.createTaskType(taskType)
    toast.success(`${created.displayName} has been added`)
    updateProject()
    setShowCreateTaskType(false)
  }

  const sendInvite = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await Api.inviteProjectMember(
      params.id!,
      new CreateProjectMemberInviteDto({
        email
      })
    )

    setShowInviteMember(false)
    toast.success(`Invitation sent to ${email}`)
  }

  const deleteTaskType = async (id: string) => {
    await Api.deleteTaskType(id)
    updateProject()
    toast.success('Task type has been deleted')
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
              <Typography variant="h4">
                {data.name}{' '}
                <IconButton>
                  <Edit />
                </IconButton>
              </Typography>

              <Typography variant="body1">Below you can add new task types or invite new members</Typography>
              <List>
                {data.taskTypes.map((x) => (
                  <ListItem
                    key={x.id}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        onClick={() => deleteTaskType(x.id)}
                      >
                        <Delete />
                      </IconButton>
                    }
                  >
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
                  onCancel={() => setShowCreateTaskType(false)}
                />
              </Collapse>
            </>
          )}
        </Loading>
      </Grid>

      <Loading {...members}>
        {(data) => (
          <Grid
            item
            xs={11}
          >
            <Typography variant="h6">Administrators</Typography>
            <List dense>
              {data
                .filter((x) => x.isAdmin)
                .map((x) => (
                  <ListItem key={x.id}>{x.user?.fullName}</ListItem>
                ))}
            </List>

            <Typography variant="h6">Members</Typography>
            <List dense>
              {data
                .filter((x) => !x.isAdmin)
                .map((x) => (
                  <ListItem key={x.id}>{x.user?.fullName}</ListItem>
                ))}

              <form onSubmit={sendInvite}>
                <Collapse in={showInviteMember}>
                  {showInviteMember && (
                    <TextField
                      name="invite-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter someones email"
                      label="Email"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              type="submit"
                              edge="end"
                            >
                              <Save />
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  )}
                </Collapse>
              </form>
              {!showInviteMember && <Button onClick={() => setShowInviteMember(true)}>Invite member</Button>}
            </List>
          </Grid>
        )}
      </Loading>
    </Grid>
  )
}

export default ProjectSettingsPage
