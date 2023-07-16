import { Button, Grid, TextField, Typography } from '@mui/material'
import { Api } from '../api'
import BigActionCard from '../components/BigActionCard'
import Loading from '../components/Loading'
import { useData } from '../hooks/useData'
import ProjectForm from '../components/project/ProjectForm'
import { useState } from 'react'
import { useProject } from '../hooks/useProject'
import { CreateProjectDto } from '../api/ApiClient'
import { useToast } from '../hooks/useToast'

const HomePage = () => {
  const [types] = useData(() => Api.getAllTypes())
  const [project, setProject] = useProject()
  const toast = useToast()
  const [projects, updateProjects] = useData(() => Api.getMyProjects())

  const createProject = async (name: string) => {
    const created = await Api.createProject(
      new CreateProjectDto({
        name: name
      })
    )

    toast.success(`The project '${created.name}' has been created`)
    setProject(created.id!)
    updateProjects()
  }
  return (
    <>
      <Loading {...projects}>
        {(data) => (
          <Grid
            container
            justifyContent="center"
          >
            <Grid
              item
              xs={11}
              md={6}
            >
              {!data.length && (
                <>
                  <Typography variant="body1">
                    Doesn't look like you have registered any children to track diaper changes. Hurry, do it now!
                  </Typography>
                  <br />

                  <ProjectForm onSubmit={createProject} />
                </>
              )}

              {data.length && <>{project?.name}</>}
            </Grid>
          </Grid>
        )}
      </Loading>
      <Loading {...types}>
        {(data) => (
          <>
            {data.map((x) => (
              <BigActionCard
                key={x.id}
                taskType={x}
              />
            ))}
          </>
        )}
      </Loading>
    </>
  )
}

export default HomePage
