import { FormControl, Grid, InputLabel, MenuItem, Select, Typography } from '@mui/material'
import { Api } from '../api'
import { CreateTaskType, ProjectDto, TaskTypeDto } from '../api/ApiClient'
import BigActionCard from '../components/BigActionCard'
import { ProjectFormCreate } from '../components/project/ProjectForm'
import Loading from '../components/shared/Loading'
import { useData } from '../hooks/useData'
import { useProject } from '../hooks/useProject'
import { useToast } from '../hooks/useToast'
import { TaskTypeFormCreate } from '../components/taskType/TaskTypeForm'

const HomePage = () => {
  const toast = useToast()
  const [projects, updateProjects] = useData(() => Api.getMyProjects())
  const [project, setProject] = useProject()

  const handleCreatedProject = async (created: ProjectDto) => {
    await setProject(created.id)
    updateProjects()
  }

  const handleCreatedTaskType = async (taskType: TaskTypeDto) => {
    await setProject(taskType.projectId)
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
        <Loading {...projects}>
          {(data) => (
            <>
              {!data.length && (
                <>
                  <Typography variant="body1">
                    Doesn't look like you have registered any children to track diaper changes. Hurry, do it now!
                  </Typography>
                  <br />

                  <ProjectFormCreate onCreated={handleCreatedProject} />
                </>
              )}

              {!!data.length && (
                <>
                  {data.length > 1 ? (
                    <FormControl fullWidth>
                      <InputLabel id="project-select-label"></InputLabel>
                      <Select
                        labelId="project-select-label"
                        id="project-select"
                        value={project?.id || ''}
                        onChange={(e) => setProject(e.target.value)}
                      >
                        {data.map((x) => (
                          <MenuItem
                            key={x.id}
                            selected={x.id === project?.id}
                            value={x.id}
                          >
                            {x.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  ) : (
                    <Typography variant="h5">{project?.name}</Typography>
                  )}
                </>
              )}
            </>
          )}
        </Loading>

        {project && !project.taskTypes.length && (
          <>
            <Typography variant="body1">
              Almost there! You just have to decide what you want to track. Diaper changes, how many times you have to
              feed your baby? Or something completely different?
            </Typography>
            <TaskTypeFormCreate
              projectId={project.id}
              onCreated={handleCreatedTaskType}
            />
          </>
        )}
        {project?.taskTypes.map((x) => (
          <BigActionCard
            key={x.id}
            taskType={x}
          />
        ))}
      </Grid>
    </Grid>
  )
}

export default HomePage
