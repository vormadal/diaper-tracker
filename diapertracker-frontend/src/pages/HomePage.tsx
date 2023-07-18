import { FormControl, Grid, InputLabel, MenuItem, Select, Typography } from '@mui/material'
import { Api } from '../api'
import { CreateProjectDto, CreateTaskType } from '../api/ApiClient'
import BigActionCard from '../components/BigActionCard'
import Loading from '../components/Loading'
import ProjectForm from '../components/project/ProjectForm'
import TaskTypeForm from '../components/taskType/TaskTypeForm'
import { useData } from '../hooks/useData'
import { useProject } from '../hooks/useProject'
import { useToast } from '../hooks/useToast'

const HomePage = () => {
  const toast = useToast()
  const [projects, updateProjects] = useData(() => Api.getMyProjects())
  const [project, setProject] = useProject()

  const createProject = async (project: CreateProjectDto) => {
    const created = await Api.createProject(project)

    toast.success(`${created.name} has been registered`)
    await setProject(created.id!)
    updateProjects()
  }

  const createTaskType = async (taskType: CreateTaskType) => {
    const created = await Api.createTaskType(taskType)
    toast.success(`${created.displayName} has been added`)
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

                  <ProjectForm onSubmit={createProject} />
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
                          <MenuItem key={x.id} selected={x.id === project?.id} value={x.id}>{x.name}</MenuItem>
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
            <TaskTypeForm
              projectId={project.id}
              onSubmit={createTaskType}
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
