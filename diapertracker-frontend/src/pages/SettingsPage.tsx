import { ChildCare } from '@mui/icons-material'
import {
  Button,
  Collapse,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography
} from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Api } from '../api'
import { CreateProjectDto } from '../api/ApiClient'
import { ProjectFormCreate } from '../components/project/ProjectForm'
import Loading from '../components/shared/Loading'
import { useData } from '../hooks/useData'

const SettingsPage = () => {
  const navigate = useNavigate()
  const [projects, updateProjects] = useData(() => Api.getMyProjects())
  const [showCreateProject, setShowCreateProject] = useState(false)

  const handleCreatedProject = async (project: CreateProjectDto) => {
    updateProjects()
    setShowCreateProject(false)
  }
  return (
    <Grid
      container
      justifyContent="center"
    >
      <Grid
        item
        xs={11}
      >
        <Loading {...projects}>
          {(data) => (
            <>
              {!data.length && (
                <Typography variant="body1">
                  Looks like there is no one registered yet. Click Add below to get started
                </Typography>
              )}

              <List>
                {data.map((x) => (
                  <ListItem key={x.id}>
                    <ListItemButton onClick={() => navigate(`/settings/${x.id}`)}>
                      <ListItemIcon>
                        <ChildCare />
                      </ListItemIcon>
                      <ListItemText primary={x.name} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
              {!showCreateProject && <Button onClick={() => setShowCreateProject(true)}>Add</Button>}

              <Collapse in={showCreateProject}>
                <ProjectFormCreate onCreated={handleCreatedProject} />
              </Collapse>
            </>
          )}
        </Loading>
      </Grid>
    </Grid>
  )
}

export default SettingsPage
