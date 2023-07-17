import { Grid, Typography } from '@mui/material'
import { Api } from '../api'
import BigActionCard from '../components/BigActionCard'
import Loading from '../components/Loading'
import { useData } from '../hooks/useData'
import ProjectForm from '../components/project/ProjectForm'
import { useProject } from '../hooks/useProject'
import { CreateProjectDto, CreateTaskType } from '../api/ApiClient'
import { useToast } from '../hooks/useToast'
import TaskTypeForm from '../components/taskType/TaskTypeForm'

const HomePage = () => {
  const toast = useToast()
  const [projects, updateProjects] = useData(() => Api.getMyProjects())
  const [project, setProject] = useProject()

  const createProject = async (name: string) => {
    const created = await Api.createProject(
      new CreateProjectDto({
        name: name
      })
    )

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

              {!!data.length && <Typography variant="h5">{project?.name}</Typography>}
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
