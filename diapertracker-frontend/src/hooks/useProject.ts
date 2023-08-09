import { useCallback, useEffect, useState } from 'react'
import { Api } from '../api'
import { ProjectDto } from '../api/ApiClient'
import { useRequest } from './useRequest'

interface ResultContent {
  project: ProjectDto | undefined
  error: string
  loading: boolean
}

type UseProjectAction = (id: string) => Promise<void>

export const useProject = (): [ResultContent, UseProjectAction] => {
  const [project, setProject] = useState<ProjectDto>()
  const [status, send] = useRequest()
  const updateProject = useCallback(
    async (id: string) => {
      localStorage.setItem('selectedProject', id)
      const { data: existing } = await send(() => Api.getProject(id))
      setProject(existing)
    },
    [send]
  )

  useEffect(() => {
    const id = localStorage.getItem('selectedProject')
    if (id) {
      updateProject(id)
    }
  }, [updateProject])

  return [{ ...status, project }, updateProject]
}
