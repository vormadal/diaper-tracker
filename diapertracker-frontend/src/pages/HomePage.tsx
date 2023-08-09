import { Grid, Typography } from '@mui/material'
import { Api } from '../api'
import { ProjectDto, TaskTypeDto } from '../api/ApiClient'
import BigActionCard from '../components/BigActionCard'
import { ProjectFormCreate } from '../components/project/ProjectForm'
import SelectProject from '../components/project/SelectProject'
import Loading from '../components/shared/Loading'
import { TaskTypeFormCreate } from '../components/taskType/TaskTypeForm'
import { useData } from '../hooks/useData'
import { useProject } from '../hooks/useProject'

const getMyProjects = () => Api.getMyProjects()
const HomePage = () => {
  const [projects, updateProjects] = useData(getMyProjects)
  const [{ project }, setProject] = useProject()

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
                    <SelectProject
                      options={data}
                      onChange={(x) => setProject(x?.id || '')}
                      selectedId={project?.id || ''}
                    />
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
